import { Request, Response } from "express";
import { ContactService } from "../services/contact/contactService";
import { sendSuccessResponse } from "../lib/apiResponse";
import { AppError } from "../errors/appError";
import { asyncHandler } from "../utils/asyncHandler";

export const createMessageController = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    throw AppError.badRequest("Name, email, and message are required");
  }

  await ContactService.createMessage({ name, email, message });
  return sendSuccessResponse(res, 200, "Message sent successfully", { success: true });
});
