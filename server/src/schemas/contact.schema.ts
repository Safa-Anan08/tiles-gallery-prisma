import { z } from "zod";

export const createMessageSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email address is required"),
    message: z.string().min(1, "Message content is required"),
  }),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>["body"];
