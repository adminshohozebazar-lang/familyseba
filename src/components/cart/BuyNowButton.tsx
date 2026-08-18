"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface BuyNowButtonProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    imageUrl: string | null;
  };
  disabled: boolean;
}

// Sits next to AddToCartButton on the product detail page — same add-to-cart
// step, but skips the cart page and goes straight to checkout, for a
// customer who already knows they want just this one item.
export function BuyNowButton({ product, disabled }: BuyNowButtonProps) {
  const router = useRouter();
  const { addItem } = useCart();

  function handleClick() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    router.push("/checkout");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="w-full rounded-md border-2 border-brand-primary bg-white px-6 py-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white sm:w-auto"
    >
      {disabled ? "Out of Stock" : "Buy Now"}
    </button>
  );
}
