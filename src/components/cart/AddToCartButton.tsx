"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    imageUrl: string | null;
  };
  disabled: boolean;
  // "full" is the big detail-page CTA (default, unchanged); "compact" is a
  // smaller button sized for a product card tile.
  variant?: "full" | "compact";
}

// The only interactive piece the product detail page needs — everything
// else there stays server-rendered. Also reused (as "compact") by
// ProductCard, so the add-to-cart + confirmation logic lives in one place.
export function AddToCartButton({ product, disabled, variant = "full" }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  const variantClass =
    variant === "compact"
      ? "w-full rounded-md bg-brand-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-accent/90 disabled:cursor-not-allowed disabled:bg-gray-300"
      : "w-full rounded-md bg-brand-accent px-6 py-3 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`transition-colors ${variantClass}`}
    >
      {disabled ? "Out of Stock" : justAdded ? "Added to Cart ✓" : "Add to Cart"}
    </button>
  );
}
