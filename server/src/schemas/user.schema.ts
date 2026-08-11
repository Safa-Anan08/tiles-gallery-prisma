import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    email: z.string().email("Valid user email is required"),
    name: z.string().min(1, "Name cannot be empty").optional(),
    image: z.string().url("Image must be a valid URL").optional().or(z.string().optional()),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
