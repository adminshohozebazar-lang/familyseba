import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { getStockStatus, STOCK_STATUS_LABEL } from "@/lib/stock";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { DEFAULT_HERBAL_DISCLAIMER } from "@/config/legal";
import { ImageGallery } from "@/components/storefront/ImageGallery";
import { YoutubeEmbed } from "@/components/storefront/YoutubeEmbed";

interface ProductDetailPageProps {
  params: { slug: string };
}

const STOCK_BADGE_CLASS = {
  IN_STOCK: "bg-green-100 text-green-700",
  LOW_STOCK: "bg-amber-100 text-amber-700",
  OUT_OF_STOCK: "bg-gray-100 text-gray-500",
} as const;

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });

  // Inactive products 404 exactly like nonexistent ones — never reveal
  // that a hidden/disabled product exists.
  if (!product || !product.isActive) {
    notFound();
  }

  const stockStatus = getStockStatus(product.stockQuantity);
  const embedUrl = product.youtubeVideoUrl ? getYoutubeEmbedUrl(product.youtubeVideoUrl) : null;
  const disclaimer = product.disclaimerText || DEFAULT_HERBAL_DISCLAIMER;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <ImageGallery images={product.imageUrls} alt={product.name} />

        <div>
          <h1 className="text-2xl font-bold text-brand-neutral-dark">{product.name}</h1>
          <p className="mt-2 text-xl font-semibold text-brand-primary">{formatPrice(product.price)}</p>

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

          <button
            type="button"
            disabled={stockStatus === "OUT_OF_STOCK"}
            className="mt-6 w-full rounded-md bg-brand-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-accent/90 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
          >
            {stockStatus === "OUT_OF_STOCK" ? "Out of Stock" : "Add to Cart"}
          </button>

          <p className="mt-6 text-xs leading-relaxed text-gray-400">{disclaimer}</p>
        </div>
      </div>

      {embedUrl && (
        <div className="mt-10 max-w-2xl">
          <h2 className="mb-3 text-lg font-semibold text-brand-neutral-dark">Product Video</h2>
          <YoutubeEmbed embedUrl={embedUrl} title={product.name} />
        </div>
      )}
    </div>
  );
}
