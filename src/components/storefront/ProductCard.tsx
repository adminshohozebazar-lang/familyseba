import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { formatPrice } from "@/lib/format";
import { hasDiscount, getDiscountPercent } from "@/lib/discount";
import { getStockStatus } from "@/lib/stock";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

type ProductCardProps = {
  product: Pick<
    Product,
    "id" | "slug" | "name" | "price" | "compareAtPrice" | "imageUrls" | "stockQuantity"
  >;
};

// Shared by the homepage's featured section and the full product listing.
// The Add to Cart button is a sibling of the <Link>, not nested inside it —
// a <button> inside an <a> is invalid HTML and would make clicking Add to
// Cart also trigger navigation.
export function ProductCard({ product }: ProductCardProps) {
  const thumbnail = product.imageUrls[0];
  const price = Number(product.price);
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discounted = hasDiscount(price, compareAtPrice);

  return (
    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-gray-100">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
          {discounted && (
            <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
              -{getDiscountPercent(price, compareAtPrice)}% OFF
            </span>
          )}
        </div>
        <div className="p-3 pb-2">
          <h3 className="truncate text-sm font-medium text-brand-neutral-dark">{product.name}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-sm font-semibold text-brand-primary">{formatPrice(price)}</p>
            {discounted && (
              <p className="text-xs text-gray-400 line-through">{formatPrice(compareAtPrice)}</p>
            )}
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3">
        <AddToCartButton
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            price,
            imageUrl: thumbnail ?? null,
          }}
          disabled={getStockStatus(product.stockQuantity) === "OUT_OF_STOCK"}
          variant="compact"
        />
      </div>
    </div>
  );
}
