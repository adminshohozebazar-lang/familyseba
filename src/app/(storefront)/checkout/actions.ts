"use server";

import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/order";
import { formatOrderNumber } from "@/lib/order";

type ActionResult = { success: true; orderNumber: string } | { success: false; error: string };

// Thrown only when stock changes *during* the transaction (a concurrent
// order beat this one) — the pre-transaction check below catches the
// common case with a friendlier, product-specific message, but a race is
// still possible between that check and the transaction actually running.
class StockRaceError extends Error {
  constructor(public productName: string) {
    super(`Stock changed for ${productName}`);
  }
}

export async function createOrder(input: CheckoutInput): Promise<ActionResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { customerName, customerPhone, district, thana, customerAddress, paymentMethod, items } = parsed.data;

  // Merge in case the same product appears twice in the submitted cart —
  // shouldn't happen from our own UI, but the server never assumes that.
  const quantitiesByProduct = new Map<string, number>();
  for (const item of items) {
    quantitiesByProduct.set(item.productId, (quantitiesByProduct.get(item.productId) ?? 0) + item.quantity);
  }
  const productIds = [...quantitiesByProduct.keys()];

  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productsById = new Map(products.map((p) => [p.id, p]));

  // Real prices and stock come from the database only — the client-cached
  // cart is never trusted for the actual order.
  for (const productId of productIds) {
    const product = productsById.get(productId);
    const quantity = quantitiesByProduct.get(productId)!;

    if (!product || !product.isActive) {
      return { success: false, error: `"${product?.name ?? "One of the items in your cart"}" is no longer available.` };
    }
    if (product.stockQuantity < quantity) {
      return {
        success: false,
        error:
          product.stockQuantity === 0
            ? `"${product.name}" is currently out of stock.`
            : `Only ${product.stockQuantity} of "${product.name}" left in stock.`,
      };
    }
  }

  const totalAmount = productIds.reduce((sum, id) => {
    const product = productsById.get(id)!;
    const quantity = quantitiesByProduct.get(id)!;
    return sum.plus(product.price.times(quantity));
  }, new Prisma.Decimal(0));

  try {
    const orderNumber = await prisma.$transaction(async (tx) => {
      // orderNumber must be set (unique, non-null) on insert, but it's
      // derived from `sequence`, which Postgres only assigns once the row
      // is created. Insert with a throwaway unique placeholder, then patch
      // it in the same transaction once the real sequence is known.
      const order = await tx.order.create({
        data: {
          orderNumber: randomUUID(),
          customerName,
          customerPhone,
          district,
          thana,
          customerAddress,
          paymentMethod,
          totalAmount,
          items: {
            create: productIds.map((id) => ({
              productId: id,
              quantity: quantitiesByProduct.get(id)!,
              priceAtOrder: productsById.get(id)!.price,
            })),
          },
        },
      });

      for (const id of productIds) {
        const quantity = quantitiesByProduct.get(id)!;
        // Guarded decrement: only succeeds if stock is still sufficient at
        // the moment this runs, closing the race window between the check
        // above and this transaction actually executing.
        const updated = await tx.product.updateMany({
          where: { id, stockQuantity: { gte: quantity } },
          data: { stockQuantity: { decrement: quantity } },
        });
        if (updated.count === 0) {
          throw new StockRaceError(productsById.get(id)!.name);
        }
      }

      const finalOrderNumber = formatOrderNumber(order.sequence);
      await tx.order.update({ where: { id: order.id }, data: { orderNumber: finalOrderNumber } });

      return finalOrderNumber;
    });

    return { success: true, orderNumber };
  } catch (err) {
    if (err instanceof StockRaceError) {
      return { success: false, error: `"${err.productName}" just sold out. Please update your cart and try again.` };
    }
    throw err;
  }
}
