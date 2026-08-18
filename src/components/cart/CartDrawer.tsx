"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { CartContents } from "@/components/cart/CartContents";

// Rendered once in the storefront layout, always mounted (not conditionally
// rendered) so the slide-in/out transform animates both ways — closing it
// just translates the panel off-screen rather than unmounting it.
export function CartDrawer() {
  const { isCartOpen, closeCart } = useCart();

  useEffect(() => {
    if (!isCartOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeCart();
    }
    window.addEventListener("keydown", handleKeyDown);

    // Lock background scroll while the drawer is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isCartOpen, closeCart]);

  return (
    <div className={`fixed inset-0 z-50 ${isCartOpen ? "" : "pointer-events-none"}`} aria-hidden={!isCartOpen}>
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 sm:max-w-md ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <h2 className="text-lg font-bold text-brand-neutral-dark">Your Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-md text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <CartContents onNavigate={closeCart} />
        </div>
      </div>
    </div>
  );
}
