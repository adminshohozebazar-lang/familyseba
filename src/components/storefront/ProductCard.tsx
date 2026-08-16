import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { formatPrice } from "@/lib/format";

type ProductCardProps = {
  product: Pick<Product, "slug" | "name" | "price" | "imageUrls">;
};

// Shared by the homepage's featured section and the full product listing.
export function ProductCard({ product }: ProductCardProps) {
  const thumbnail = product.imageUrls[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white"
    >
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
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-brand-neutral-dark">{product.name}</h3>
        <p className="mt-1 text-sm font-semibold text-brand-primary">{formatPrice(product.price)}</p>
        <span className="mt-2 inline-block text-xs font-medium text-brand-accent group-hover:underline">
          View Details
        </span>
      </div>
    </Link>
  );
}
