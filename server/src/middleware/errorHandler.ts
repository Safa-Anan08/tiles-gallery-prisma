import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/appError";


import { sendErrorResponse } from "../lib/apiResponse";

export const globalErrorHandler = (
  err: Error | AppError | ZodError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // 1. Zod Input Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.slice(1).join("."),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation error",
      data: {
        errors: formattedErrors,
      },
    });
  }

  // 2. Prisma Database Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[])?.join(", ") || "field";
      return sendErrorResponse(res, 400, `Unique constraint failed on ${target}`);
    }
    if (err.code === "P2025") {
      return sendErrorResponse(res, 404, "Requested database record not found");
    }
    return sendErrorResponse(res, 400, "Database operation failed");
  }

  // 3. Operational Application Error
  if (err instanceof AppError) {
    return sendErrorResponse(res, err.statusCode, err.message);
  }

  // 4. Log unhandled internal errors in development mode
  if (process.env.NODE_ENV === "development") {
    console.error("🔥 UNHANDLED ERROR:", err);
  }

  // 5. Generic 500 Error to client without leaking stack traces
  return sendErrorResponse(res, 500, "Internal server error");
};
