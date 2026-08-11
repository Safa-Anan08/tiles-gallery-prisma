import { Response } from "express";
import { ReviewService } from "../services/review/reviewService";
import { sendSuccessResponse } from "../lib/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest, UserRole } from "../types/auth";
import { AppError } from "../errors/appError";

export const getReviewsByTileController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tileId = (req.query.tileId as string) || (req.params.tileId as string);
  if (!tileId) {
    throw AppError.badRequest("Tile ID is required");
  }

  const reviews = await ReviewService.getReviewsByTileId(tileId);
  return sendSuccessResponse(res, 200, "Reviews retrieved successfully", reviews);
});

export const getReviewByIdController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const review = await ReviewService.getReviewById(id);
  return sendSuccessResponse(res, 200, "Review retrieved successfully", review);
});

export const createReviewController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw AppError.unauthorized("Authentication required");
  }

  const review = await ReviewService.createReview(req.user.id, req.body);
  return sendSuccessResponse(res, 201, "Review created successfully", review);
});

export const updateReviewController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw AppError.unauthorized("Authentication required");
  }

  const id = req.params.id as string;
  const review = await ReviewService.updateReview(id, req.user.id, req.body);
  return sendSuccessResponse(res, 200, "Review updated successfully", review);
});

export const deleteReviewController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw AppError.unauthorized("Authentication required");
  }

  const id = req.params.id as string;
  const isAdmin = req.user.role === UserRole.ADMIN;
  await ReviewService.deleteReview(id, req.user.id, isAdmin);
  return sendSuccessResponse(res, 200, "Review deleted successfully", { success: true });
});
