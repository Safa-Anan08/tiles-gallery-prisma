import { Response } from "express";
import { CartService } from "../services/cart/cartService";
import { sendSuccessResponse } from "../lib/apiResponse";
import { AppError } from "../errors/appError";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../types/auth";

export const getCartController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const email = req.user?.email || (req.query.email as string);

  if (!email) {
    return sendSuccessResponse(res, 200, "Cart fetched", []);
  }

  const items = await CartService.getCartByEmail(email);
  return sendSuccessResponse(res, 200, "Cart fetched successfully", items);
});

export const addToCartController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userEmail = req.user?.email || req.body?.userEmail;
  const tileId = req.body?.tileId;

  if (!userEmail || !tileId) {
    throw AppError.badRequest("User email and tile ID are required");
  }

  const result = await CartService.addToCart(userEmail, tileId);
  if (!result) {
    throw AppError.notFound("User not found");
  }

  return sendSuccessResponse(res, 200, "Item added to cart", { success: true });
});

export const deleteFromCartController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userEmail = req.user?.email || req.body?.userEmail || (req.query?.userEmail as string);
  const tileId = req.body?.tileId || (req.query?.tileId as string);

  if (!userEmail || !tileId) {
    throw AppError.badRequest("User email and tile ID are required");
  }

  const result = await CartService.deleteFromCart(userEmail, tileId);
  if (!result) {
    throw AppError.notFound("User not found");
  }

  return sendSuccessResponse(res, 200, "Item deleted from cart", { success: true, result });
});
