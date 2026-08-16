"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

// Cart contents live only in localStorage (via CartContext), so this can't
// be server-rendered — there's nothing in the database to fetch.
export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

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

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-neutral-dark">Your Cart</h1>

      <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.slug}`}
                className="block truncate text-sm font-medium text-brand-neutral-dark hover:underline"
              >
                {item.name}
              </Link>
              <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                aria-label="Decrease quantity"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                aria-label="Increase quantity"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
            </div>

            <p className="w-20 shrink-0 text-right text-sm font-semibold text-brand-neutral-dark">
              {formatPrice(item.price * item.quantity)}
            </p>

            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              aria-label={`Remove ${item.name}`}
              className="shrink-0 text-gray-400 hover:text-red-600"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg font-semibold text-brand-neutral-dark">Total</span>
        <span className="text-lg font-bold text-brand-primary">{formatPrice(subtotal)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-md bg-brand-accent py-3 text-center text-sm font-semibold text-white hover:bg-brand-accent/90"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
