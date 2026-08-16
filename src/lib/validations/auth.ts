import { z } from "zod";

// Shared by the login form (client-side pre-check) and, implicitly, by
// NextAuth's authorize() callback, which trusts nothing from the client.
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
