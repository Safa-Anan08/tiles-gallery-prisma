import { Request, Response } from "express";
import { ProductService } from "../services/product/productService";
import { sendSuccessResponse } from "../lib/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllTilesController = asyncHandler(async (req: Request, res: Response) => {
  const tiles = await ProductService.getAllTiles();
  return sendSuccessResponse(res, 200, "Tiles fetched successfully", tiles);
});

export const getTileByIdController = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const tile = await ProductService.getTileById(id);
  return sendSuccessResponse(res, 200, "Tile fetched successfully", tile);
});

export const createTileController = asyncHandler(async (req: Request, res: Response) => {
  const tile = await ProductService.createTile(req.body);
  return sendSuccessResponse(res, 201, "Tile created successfully", tile);
});

export const updateTileController = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const tile = await ProductService.updateTile(id, req.body);
  return sendSuccessResponse(res, 200, "Tile updated successfully", tile);
});

export const deleteTileController = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await ProductService.deleteTile(id);
  return sendSuccessResponse(res, 200, "Tile deleted successfully", { success: true });
});
