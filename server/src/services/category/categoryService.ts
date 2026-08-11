import prisma from "../../lib/prisma";
import { AppError } from "../../errors/appError";

export class CategoryService {
  static async getAllCategories() {
    return prisma.category.findMany({
      where: { isDeleted: false },
      orderBy: { name: "asc" },
    });
  }

  static async getCategoryById(id: string) {
    const category = await prisma.category.findFirst({
      where: { id, isDeleted: false },
    });

    if (!category) {
      throw AppError.notFound("Category not found");
    }

    return category;
  }

  static async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
  }) {
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: data.slug }],
        isDeleted: false,
      },
    });

    if (existing) {
      throw AppError.badRequest("Category with this name or slug already exists");
    }

    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        image: data.image || null,
      },
    });
  }

  static async updateCategory(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      image?: string;
    }
  ) {
    await this.getCategoryById(id);

    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(id: string) {
    await this.getCategoryById(id);

    return prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
