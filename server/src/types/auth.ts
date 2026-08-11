import { Request } from "express";
import { UserRole, TileStatus } from "../../../prisma/generated/client";

export { UserRole, TileStatus };

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string | null;
}

// Extend Express Request interface to attach authenticated user
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
