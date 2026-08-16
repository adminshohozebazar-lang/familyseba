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
}

// The only interactive piece the product detail page needs — everything
// else there stays server-rendered.
export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
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

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="mt-6 w-full rounded-md bg-brand-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-accent/90 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
    >
      {disabled ? "Out of Stock" : justAdded ? "Added to Cart ✓" : "Add to Cart"}
    </button>
  );
}
