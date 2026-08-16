import { z } from "zod";

// Slug is derived server-side from `name`, same as categories — never
// supplied by the client. Price/stock use z.coerce since form inputs
// arrive as strings even though the UI treats them as numbers.
export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200, "Name is too long"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  stockQuantity: z.coerce
    .number({ invalid_type_error: "Stock quantity must be a number" })
    .int("Stock quantity must be a whole number")
    .min(0, "Stock quantity cannot be negative"),
  categoryId: z.string().min(1, "Category is required"),
  imageUrls: z.array(z.string().url()).default([]),
  youtubeVideoUrl: z.union([z.string().trim().url("Enter a valid URL"), z.literal("")]).optional(),
  dosageInstructions: z.string().trim().max(2000, "Dosage instructions are too long").optional(),
  disclaimerText: z.string().trim().max(2000, "Disclaimer text is too long").optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
