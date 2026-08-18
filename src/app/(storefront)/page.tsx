import Link from "next/link";
import { prisma } from "@/lib/db";
import { HERO_SLIDES, PROMO_BANNERS, TESTIMONIALS, VIDEO_GALLERY_IDS } from "@/config/homepage";
import { ProductCard } from "@/components/storefront/ProductCard";
import { HeroCarousel } from "@/components/storefront/HeroCarousel";
import { PromoBanner } from "@/components/storefront/PromoBanner";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";
import { Testimonials } from "@/components/storefront/Testimonials";
import { VideoGallery } from "@/components/storefront/VideoGallery";

const FEATURED_PRODUCT_COUNT = 8;

// Without this, Next.js prerenders the homepage once at build time (no
// dynamic APIs are used here otherwise), so new/edited products from the
// admin panel wouldn't show up until the next deploy.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: FEATURED_PRODUCT_COUNT,
    }),
    // Only categories that currently have something to show — a card
    // leading to a guaranteed-empty listing isn't useful navigation.
    prisma.category.findMany({
      where: { products: { some: { isActive: true } } },
      orderBy: { name: "asc" },
      select: { slug: true, name: true, iconUrl: true },
    }),
  ]);

  return (
    <div>
      <HeroCarousel slides={HERO_SLIDES} />

      {PROMO_BANNERS.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PROMO_BANNERS.map((banner, index) => (
              <PromoBanner key={index} banner={banner} />
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-8">
          <h2 className="mb-4 text-xl font-bold text-brand-neutral-dark">Shop by Category</h2>
          <CategoryGrid categories={categories} />
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 pb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-neutral-dark">Featured Products</h2>
          <Link href="/products" className="text-sm font-medium text-brand-primary hover:underline">
            View All
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-gray-300 py-12 text-center text-gray-400">
            Products coming soon.
          </p>
        )}
      </section>

      <Testimonials testimonials={TESTIMONIALS} />
      <VideoGallery videoIds={VIDEO_GALLERY_IDS} />
    </div>
  );
}
