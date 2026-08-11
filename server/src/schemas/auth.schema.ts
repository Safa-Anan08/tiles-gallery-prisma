import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().optional().nullable(),
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});


export const googleAuthSchema = z.object({
  body: z.object({
    idToken: z.string().optional(),
    credential: z.string().optional(),
  }).refine((data) => data.idToken || data.credential, {
    message: "Google idToken or credential parameter is required",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>["body"];
export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>["body"];

