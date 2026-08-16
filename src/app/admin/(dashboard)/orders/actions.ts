"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isValidStatusTransition } from "@/lib/order-status";

const updateStatusSchema = z.object({
  orderId: z.string().min(1),
  newStatus: z.nativeEnum(OrderStatus),
});

type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
type ActionResult = { success: true } | { success: false; error: string };

export async function updateOrderStatus(input: UpdateStatusInput): Promise<ActionResult> {
  const parsed = updateStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { orderId, newStatus } = parsed.data;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return { success: false, error: "Order not found" };
  }

  // The transition map is the single source of truth for what's allowed —
  // re-checked here server-side regardless of what buttons the client showed.
  if (!isValidStatusTransition(order.status, newStatus)) {
    return { success: false, error: `Cannot change status from ${order.status} to ${newStatus}` };
  }

  await prisma.$transaction(async (tx) => {
    // Cancelling reverses the stock decrement checkout performed. Returning
    // an already-cancelled/returned order is structurally impossible here
    // since both are terminal in ORDER_STATUS_TRANSITIONS (no outgoing
    // transitions), but the explicit check keeps the intent obvious.
    if (newStatus === "CANCELLED" && order.status !== "CANCELLED" && order.status !== "RETURNED") {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } },
        });
      }
    }

    await tx.order.update({ where: { id: orderId }, data: { status: newStatus } });
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");

  return { success: true };
}
