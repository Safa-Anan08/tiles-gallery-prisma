import { Request } from "express";
import { UserRole, TileStatus } from "@prisma/client";


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

// Extend Express Request interface to attach authenticated user while preserving Express Request properties
export interface AuthenticatedRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: AuthUser;
}

