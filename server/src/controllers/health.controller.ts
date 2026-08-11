import { Request, Response } from "express";
import { sendSuccessResponse } from "../lib/apiResponse";

export const getHealthStatus = (req: Request, res: Response) => {
  return sendSuccessResponse(res, 200, "API is healthy", {
    service: "tiles-gallery-api",
  });
};
