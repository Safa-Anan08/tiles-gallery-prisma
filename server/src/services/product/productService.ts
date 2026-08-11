import prisma from "../../lib/prisma";
import { Tile, TileStatus } from "@prisma/client";
import { AppError } from "../../errors/appError";

export class ProductService {
  /**
   * Retrieves all non-deleted tiles ordered by ID ascending
   */
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

  /**
   * Retrieves a single tile by ID if not soft-deleted
   */
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

  /**
   * Creates a new tile
   */
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

  /**
   * Updates an existing tile
   */
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

  /**
   * Soft deletes a tile by setting isDeleted = true
   */
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
