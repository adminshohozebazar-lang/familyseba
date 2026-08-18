import { z } from "zod";

// Slug is deliberately excluded here — it's derived server-side from `name`
// via slugify(), never supplied by the client.
export const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().trim().max(1000, "Description is too long").optional(),
  iconUrl: z.union([z.string().trim().url("Enter a valid URL"), z.literal("")]).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
