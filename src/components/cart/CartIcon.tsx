"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function CartIcon() {
  const { itemCount, openCart } = useCart();

  return (
    <Link
      href="/cart"
      onClick={(event) => {
        // The href keeps this a real link (progressive enhancement — a
        // right-click "open in new tab" or no-JS visit still lands on the
        // /cart fallback page); a plain click opens the drawer instead.
        event.preventDefault();
        openCart();
      }}
      className="relative text-brand-neutral-dark hover:text-brand-primary"
      aria-label="Cart"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.5l.9 4.5m0 0L6 15h11.25l2.25-7.5H4.65m0 0L4.65 7.5M9 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-semibold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
