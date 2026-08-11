import prisma from "../../lib/prisma";
import { Tile, TileStatus } from "@prisma/client";

import { AppError } from "../../errors/appError";


export class ProductService {

  static async getAllTiles(): Promise<Tile[]> {
    return prisma.tile.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        id: "asc",
      },
    });
  }


  static async getTileById(id: string): Promise<Tile | null> {
    const tile = await prisma.tile.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!tile) {
      throw AppError.notFound("Tile not found");
    }

    return tile;
  }


  static async createTile(data: {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number;
    currency?: string;
    dimensions: string;
    material: string;
    tags?: string[];
    inStock?: boolean;
    status?: TileStatus;
  }): Promise<Tile> {
    const existing = await prisma.tile.findFirst({
      where: { id: data.id, isDeleted: false },
    });

    if (existing) {
      throw AppError.badRequest("Tile with this ID already exists");
    }

    return prisma.tile.create({
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image,
        category: data.category,
        price: data.price,
        currency: data.currency || "USD",
        dimensions: data.dimensions,
        material: data.material,
        tags: data.tags || [],
        inStock: data.inStock !== undefined ? data.inStock : true,
        status: data.status || TileStatus.AVAILABLE,
      },
    });
  }


  static async updateTile(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      image: string;
      category: string;
      price: number;
      currency: string;
      dimensions: string;
      material: string;
      tags: string[];
      inStock: boolean;
      status: TileStatus;
    }>
  ): Promise<Tile> {
    await this.getTileById(id);

    return prisma.tile.update({
      where: { id },
      data,
    });
  }


  static async deleteTile(id: string): Promise<Tile> {
    await this.getTileById(id);

    return prisma.tile.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}

// Backward compatibility alias for tile service
export const TileService = ProductService;
