"use client";

import { useState, FormEvent } from "react";
import { trackOrder, type TrackedOrder } from "./actions";
import { trackOrderSchema } from "@/lib/validations/order";
import { formatPrice, formatDate } from "@/lib/format";
import { ORDER_STATUS_LABEL, ORDER_STATUS_BADGE_CLASS } from "@/lib/order-status";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function TrackOrderPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<TrackedOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOrders(null);

    const result = trackOrderSchema.safeParse({ phone });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setIsSubmitting(true);
    const actionResult = await trackOrder(result.data);
    setIsSubmitting(false);

    if (!actionResult.success) {
      setError(actionResult.error);
      return;
    }
    setOrders(actionResult.orders);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-brand-neutral-dark">Track Your Order</h1>
      <p className="mb-6 text-sm text-gray-500">Enter the phone number you used when placing your order.</p>

      <form onSubmit={handleSubmit} noValidate className="flex gap-2">
        <Input
          type="tel"
          placeholder="01XXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-label="Phone number"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Searching..." : "Track Order"}
        </Button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {orders && orders.length === 0 && (
        <p className="mt-8 rounded-lg border border-dashed border-gray-300 py-10 text-center text-gray-400">
          No orders found for this number.
        </p>
      )}

      {orders && orders.length > 0 && (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-brand-neutral-dark">{order.orderNumber}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${ORDER_STATUS_BADGE_CLASS[order.status]}`}
                >
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">{formatDate(order.createdAt)}</p>

              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-sm font-semibold">
                <span className="text-brand-neutral-dark">Total</span>
                <span className="text-brand-primary">{formatPrice(order.totalAmount)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
