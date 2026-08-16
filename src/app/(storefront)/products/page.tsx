import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategoryPills } from "@/components/storefront/CategoryPills";
import { Pagination } from "@/components/storefront/Pagination";

const PAGE_SIZE = 20;

interface ProductsPageProps {
  searchParams: { category?: string; page?: string };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categorySlug = searchParams.category;
  const currentPage = Math.max(1, Number(searchParams.page) || 1);

  const where = {
    isActive: true,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  };

  const [products, totalCount, categories, activeCategory] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    // Only categories with something to show — same reasoning as the homepage.
    prisma.category.findMany({
      where: { products: { some: { isActive: true } } },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
    categorySlug
      ? prisma.category.findUnique({ where: { slug: categorySlug }, select: { name: true } })
      : null,
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function buildHref(page: number) {
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-neutral-dark">
        {activeCategory ? activeCategory.name : "All Products"}
      </h1>

      <div className="mb-6">
        <CategoryPills categories={categories} activeSlug={categorySlug} showAll />
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} buildHref={buildHref} />
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-gray-300 py-12 text-center text-gray-400">
          {activeCategory
            ? `No products yet in ${activeCategory.name}.`
            : "No products available yet."}
        </p>
      )}
    </div>
  );
}
