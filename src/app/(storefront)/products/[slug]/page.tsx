import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { getStockStatus, STOCK_STATUS_LABEL } from "@/lib/stock";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { hasDiscount, getDiscountPercent } from "@/lib/discount";
import { DEFAULT_HERBAL_DISCLAIMER } from "@/config/legal";
import { ImageGallery } from "@/components/storefront/ImageGallery";
import { YoutubeEmbed } from "@/components/storefront/YoutubeEmbed";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ContactButtons } from "@/components/storefront/ContactButtons";
import { TrustBadges } from "@/components/storefront/TrustBadges";
import { ShareButtons } from "@/components/storefront/ShareButtons";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { BuyNowButton } from "@/components/cart/BuyNowButton";

interface ProductDetailPageProps {
  params: { slug: string };
}

const STOCK_BADGE_CLASS = {
  IN_STOCK: "bg-green-100 text-green-700",
  LOW_STOCK: "bg-amber-100 text-amber-700",
  OUT_OF_STOCK: "bg-gray-100 text-gray-500",
} as const;

const RELATED_PRODUCT_COUNT = 4;

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Next.js does not decode non-ASCII characters in dynamic route segments —
  // params.slug arrives as the raw percent-encoded string (e.g. "%E0%A6...")
  // for a Bengali slug, which never matches anything in the database as-is.
  const slug = decodeURIComponent(params.slug);
  const product = await prisma.product.findUnique({ where: { slug } });

  // Inactive products 404 exactly like nonexistent ones — never reveal
  // that a hidden/disabled product exists.
  if (!product || !product.isActive) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isActive: true, id: { not: product.id } },
    orderBy: { createdAt: "desc" },
    take: RELATED_PRODUCT_COUNT,
  });

  const stockStatus = getStockStatus(product.stockQuantity);
  const embedUrl = product.youtubeVideoUrl ? getYoutubeEmbedUrl(product.youtubeVideoUrl) : null;
  const disclaimer = product.disclaimerText || DEFAULT_HERBAL_DISCLAIMER;

  const price = Number(product.price);
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discounted = hasDiscount(price, compareAtPrice);
  const isOutOfStock = stockStatus === "OUT_OF_STOCK";

  const cartProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price,
    imageUrl: product.imageUrls[0] ?? null,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <ImageGallery images={product.imageUrls} alt={product.name} />

        <div>
          <h1 className="text-2xl font-bold text-brand-neutral-dark">{product.name}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-xl font-semibold text-brand-primary">{formatPrice(price)}</p>
            {discounted && (
              <>
                <p className="text-base text-gray-400 line-through">{formatPrice(compareAtPrice)}</p>
                <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                  -{getDiscountPercent(price, compareAtPrice)}% OFF
                </span>
              </>
            )}
          </div>

          <span
            className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${STOCK_BADGE_CLASS[stockStatus]}`}
          >
            {STOCK_STATUS_LABEL[stockStatus]}
          </span>

          <p className="mt-4 whitespace-pre-line text-sm text-brand-neutral-dark">{product.description}</p>

          {product.dosageInstructions && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-brand-neutral-dark">Dosage Instructions</h2>
              <p className="mt-1 whitespace-pre-line text-sm text-gray-600">{product.dosageInstructions}</p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton product={cartProduct} disabled={isOutOfStock} />
            <BuyNowButton product={cartProduct} disabled={isOutOfStock} />
          </div>

          <TrustBadges />

          <ContactButtons productName={product.name} />

          <ShareButtons productName={product.name} />

          <p className="mt-6 text-xs leading-relaxed text-gray-400">{disclaimer}</p>
        </div>
      </div>

      {embedUrl && (
        <div className="mt-10 max-w-2xl">
          <h2 className="mb-3 text-lg font-semibold text-brand-neutral-dark">Product Video</h2>
          <YoutubeEmbed embedUrl={embedUrl} title={product.name} />
        </div>
      )}

      {relatedProducts.length > 0 && (
        <section className="mt-12 border-t border-gray-100 pt-8">
          <h2 className="mb-4 text-xl font-bold text-brand-neutral-dark">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
