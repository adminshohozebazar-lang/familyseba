import { z } from "zod";
import { PaymentMethod } from "@prisma/client";

// Bangladeshi mobile numbers: 11 digits, starting with 01. Shared by
// checkout and the track-order lookup — one regex, one error message.
const BD_PHONE_REGEX = /^01\d{9}$/;
export const bdPhoneSchema = z
  .string()
  .trim()
  .regex(BD_PHONE_REGEX, "Enter a valid Bangladeshi phone number (11 digits, starting with 01)");

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(1, "Name is required").max(200, "Name is too long"),
  customerPhone: bdPhoneSchema,
  customerAddress: z.string().trim().min(1, "Delivery address is required").max(1000, "Address is too long"),
  // z.nativeEnum reads straight from the Prisma enum, so adding BKASH/NAGAD/
  // CARD there later is enough to make them valid here too — no schema change.
  paymentMethod: z.nativeEnum(PaymentMethod),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().positive(),
      })
    )
    .min(1, "Your cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const trackOrderSchema = z.object({
  phone: bdPhoneSchema,
});

export type TrackOrderInput = z.infer<typeof trackOrderSchema>;
