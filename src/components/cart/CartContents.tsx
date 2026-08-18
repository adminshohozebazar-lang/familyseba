"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

interface CartContentsProps {
  // Called when a link inside here is clicked (Browse Products / Proceed to
  // Checkout) — the drawer uses this to close itself before navigating away;
  // the standalone /cart page leaves it undefined since there's nothing to close.
  onNavigate?: () => void;
}

// Item list, empty state, total, and checkout button — the actual cart UI,
// with no page-level container/heading of its own so both the drawer and
// the /cart fallback page can wrap it however fits their layout.
export function CartContents({ onNavigate }: CartContentsProps) {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link
          href="/products"
          onClick={onNavigate}
          className="mt-4 inline-block text-sm font-medium text-brand-primary hover:underline"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
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
                onClick={onNavigate}
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
        onClick={onNavigate}
        className="mt-6 block w-full rounded-md bg-brand-accent py-3 text-center text-sm font-semibold text-white hover:bg-brand-accent/90"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
