import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";
import { AuthenticatedRequest, UserRole } from "../types/auth";
import { sendErrorResponse } from "../lib/apiResponse";

export const authenticateJwt = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendErrorResponse(res, 401, "Authentication required");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return sendErrorResponse(res, 401, "Authentication required");
  }

  const token = parts[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    };
    return next();
  } catch (error) {
    return sendErrorResponse(res, 401, "Invalid or expired token");
  }
};

export const requireRole = (requiredRole: UserRole) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendErrorResponse(res, 401, "Authentication required");
    }

    if (req.user.role !== requiredRole && req.user.role !== UserRole.ADMIN) {
      return sendErrorResponse(res, 403, "Insufficient permissions");
    }

    return next();
  };
};
