"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PaymentMethod } from "@prisma/client";
import { useCart } from "@/context/CartContext";
import { createOrder } from "./actions";
import { checkoutSchema } from "@/lib/validations/order";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block text-sm font-medium text-brand-primary hover:underline">
          Browse Products
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const candidate = {
      customerName,
      customerPhone,
      customerAddress,
      paymentMethod,
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    };

    const result = checkoutSchema.safeParse(candidate);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setIsSubmitting(true);
    const actionResult = await createOrder(result.data);
    setIsSubmitting(false);

    if (!actionResult.success) {
      setError(actionResult.error);
      return;
    }

    // Clearing the cart has to happen here (client-side, after a successful
    // response) rather than inside the server action — the action has no
    // access to localStorage, and a redirect() there would short-circuit
    // before this code ever ran.
    clearCart();
    router.push(`/order-confirmation/${actionResult.orderNumber}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-neutral-dark">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 rounded-lg border border-gray-200 bg-white p-6"
        >
          <div>
            <Label htmlFor="customerName">Full Name</Label>
            <Input
              id="customerName"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input
              id="customerPhone"
              type="tel"
              placeholder="01XXXXXXXXX"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="customerAddress">Delivery Address</Label>
            <Textarea
              id="customerAddress"
              rows={3}
              required
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </div>

          <div>
            <Label>Payment Method</Label>
            <div className="mt-1 space-y-2">
              <label className="flex items-center gap-2 text-sm text-brand-neutral-dark">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={PaymentMethod.COD}
                  checked={paymentMethod === PaymentMethod.COD}
                  onChange={() => setPaymentMethod(PaymentMethod.COD)}
                />
                Cash on Delivery
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </Button>
        </form>

        <div className="h-fit rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-brand-neutral-dark">Order Summary</h2>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-4">
                <span className="text-brand-neutral-dark">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0 text-gray-500">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-base font-semibold">
            <span className="text-brand-neutral-dark">Total</span>
            <span className="text-brand-primary">{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
