import { z } from "zod";
import { TileStatus } from "../types/auth";

export const createTileSchema = z.object({
  body: z.object({
    id: z.string().min(1, "Tile ID is required"),
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    image: z.string().url("Image must be a valid URL"),
    category: z.string().min(2, "Category is required"),
    price: z.number().positive("Price must be positive"),
    currency: z.string().optional().default("USD"),
    dimensions: z.string().min(2, "Dimensions are required"),
    material: z.string().min(2, "Material is required"),
    tags: z.array(z.string()).optional().default([]),
    inStock: z.boolean().optional().default(true),
    status: z.nativeEnum(TileStatus).optional().default(TileStatus.AVAILABLE),
  }),
});

export const updateTileSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(5).optional(),
    image: z.string().url().optional(),
    category: z.string().min(2).optional(),
    price: z.number().positive().optional(),
    currency: z.string().optional(),
    dimensions: z.string().min(2).optional(),
    material: z.string().min(2).optional(),
    tags: z.array(z.string()).optional(),
    inStock: z.boolean().optional(),
    status: z.nativeEnum(TileStatus).optional(),
  }),
});
