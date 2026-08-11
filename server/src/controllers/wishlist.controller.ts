import { Response } from "express";
import { WishlistService } from "../services/wishlist/wishlistService";
import { sendSuccessResponse } from "../lib/apiResponse";
import { AppError } from "../errors/appError";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../types/auth";

export const getWishlistController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const email = req.user?.email || (req.query.email as string);

  if (!email) {
    return sendSuccessResponse(res, 200, "Wishlist fetched", []);
  }

  const items = await WishlistService.getWishlistByEmail(email);
  return sendSuccessResponse(res, 200, "Wishlist fetched successfully", items);
});

export const addToWishlistController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userEmail = req.user?.email || req.body?.userEmail;
  const tileId = req.body?.tileId;

  if (!userEmail || !tileId) {
    throw AppError.badRequest("User email and tile ID are required");
  }

  const result = await WishlistService.addToWishlist(userEmail, tileId);
  if (!result) {
    throw AppError.notFound("User not found");
  }

  return sendSuccessResponse(res, 200, "Item added to wishlist", { success: true });
});

export const deleteFromWishlistController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userEmail = req.user?.email || req.body?.userEmail || (req.query?.userEmail as string);
  const tileId = req.body?.tileId || (req.query?.tileId as string);

  if (!userEmail || !tileId) {
    throw AppError.badRequest("User email and tile ID are required");
  }

  const result = await WishlistService.deleteFromWishlist(userEmail, tileId);
  if (!result) {
    throw AppError.notFound("User not found");
  }

  return sendSuccessResponse(res, 200, "Item deleted from wishlist", { success: true, result });
});
