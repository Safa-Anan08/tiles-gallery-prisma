import { z } from "zod";

export const getWishlistSchema = z.object({
  query: z.object({
    email: z.string().email("Invalid user email format").optional().or(z.literal("")),
  }),
});

export const wishlistItemSchema = z.object({
  body: z.object({
    userEmail: z.string().email("Valid user email is required"),
    tileId: z.string().min(1, "Tile ID is required"),
  }),
});

export type WishlistItemInput = z.infer<typeof wishlistItemSchema>["body"];
