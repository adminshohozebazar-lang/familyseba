import Link from "next/link";
import { prisma } from "@/lib/db";
import { SITE_NAME, SITE_TAGLINE } from "@/config/site";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategoryPills } from "@/components/storefront/CategoryPills";

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
    // Only categories that currently have something to show — a pill
    // leading to a guaranteed-empty listing isn't useful navigation.
    prisma.category.findMany({
      where: { products: { some: { isActive: true } } },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

  return (
    <div>
      <section className="bg-brand-primary px-4 py-16 text-center text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">{SITE_NAME}</h1>
        <p className="mx-auto mt-3 max-w-md text-brand-neutral-light/90">{SITE_TAGLINE}</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-md bg-brand-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-accent/90"
        >
          Shop Now
        </Link>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-8">
          <CategoryPills categories={categories} />
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
    </div>
  );
}
