import prisma from "../../lib/prisma";
import { User } from "@prisma/client";



export class UserService {

  static async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email,
        isDeleted: false,
      },
    });
  }

  static async getAllUsers() {
    return prisma.user.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }


  static async updateUserProfile(
    email: string,
    data: { name?: string; image?: string }
  ): Promise<User> {
    return prisma.user.update({
      where: { email },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.image !== undefined && { image: data.image }),
      },
    });
  }
}
