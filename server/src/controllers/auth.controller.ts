import { Response } from "express";
import { AuthService } from "../services/auth/authService";
import { sendSuccessResponse } from "../lib/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../types/auth";
import { AppError } from "../errors/appError";

export const registerController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password } = req.body;
  const result = await AuthService.registerUser({ name, email, password });
  return sendSuccessResponse(res, 201, "User registered successfully", result);
});

export const loginController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email, password } = req.body;
  const result = await AuthService.loginUser({ email, password });
  return sendSuccessResponse(res, 200, "Login successful", result);
});

export const meController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw AppError.unauthorized("Authentication token required");
  }

  const user = await AuthService.getUserById(req.user.id);
  return sendSuccessResponse(res, 200, "Current user profile fetched successfully", user);
});

export const logoutController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccessResponse(
    res,
    200,
    "Logged out successfully. Please remove stored access token on client.",
    null
  );
});
