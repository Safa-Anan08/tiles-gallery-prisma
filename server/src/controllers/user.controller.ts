import { Response } from "express";
import { UserService } from "../services/user/userService";
import { sendSuccessResponse } from "../lib/apiResponse";
import { AppError } from "../errors/appError";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../types/auth";

export const getAllUsersController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const users = await UserService.getAllUsers();
  return sendSuccessResponse(res, 200, "Users retrieved successfully", users);
});

export const updateUserProfileController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const email = req.user?.email || req.body.email;
  const { name, image } = req.body;

  if (!email) {
    throw AppError.badRequest("User email is required");
  }

  const updatedUser = await UserService.updateUserProfile(email, { name, image });
  return sendSuccessResponse(res, 200, "User profile updated successfully", {
    success: true,
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
    },
  });
});
