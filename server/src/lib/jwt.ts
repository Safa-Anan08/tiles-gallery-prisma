import jwt from "jsonwebtoken";
import { JwtPayload, UserRole } from "../types/auth";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing!");
    }
    return "default_dev_scic_ejp13_secret_key_change_in_production";
  }
  return secret;
};

const getJwtExpiresIn = (): string => {
  return process.env.JWT_EXPIRES_IN || "7d";
};

export const signAccessToken = (payload: {
  userId: string;
  email: string;
  role: UserRole;
}): string => {
  const secret = getJwtSecret();
  const expiresIn = getJwtExpiresIn();

  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    },
    secret,
    {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    }
  );
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const secret = getJwtSecret();
  const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

  if (!decoded || typeof decoded !== "object" || !decoded.userId || !decoded.email) {
    throw new Error("Invalid token payload structure");
  }

  return {
    userId: decoded.userId as string,
    email: decoded.email as string,
    role: (decoded.role as UserRole) || UserRole.USER,
    iat: decoded.iat,
    exp: decoded.exp,
  };
};
