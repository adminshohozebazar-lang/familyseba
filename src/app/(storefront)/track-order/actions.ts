"use server";

import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { trackOrderSchema, type TrackOrderInput } from "@/lib/validations/order";

export interface TrackedOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: Date;
  totalAmount: number;
  items: { name: string; quantity: number }[];
}

type ActionResult = { success: true; orders: TrackedOrder[] } | { success: false; error: string };

// Takes the phone number via a Server Action (POST, not a query string) —
// phone numbers are personal data and shouldn't end up in browser history
// or server access logs the way a GET route's URL would.
export async function trackOrder(input: TrackOrderInput): Promise<ActionResult> {
  const parsed = trackOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const orders = await prisma.order.findMany({
    // Exact match on the indexed column, not a partial search — this is a
    // customer looking up their own orders, not an admin doing a lookup.
    where: { customerPhone: parsed.data.phone },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return {
    success: true,
    orders: orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      // Decimal instances can't cross the Server Action boundary — must be
      // a plain number by the time this returns to the client.
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({ name: item.product.name, quantity: item.quantity })),
    })),
  };
}
