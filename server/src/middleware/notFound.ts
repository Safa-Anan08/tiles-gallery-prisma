import { Request, Response } from "express";
import { sendErrorResponse } from "../lib/apiResponse";

export const notFoundHandler = (req: Request, res: Response) => {
  return sendErrorResponse(res, 404, `Route ${req.originalUrl} not found`);
};
