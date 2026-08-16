import Link from "next/link";

interface CategoryPillsProps {
  categories: { slug: string; name: string }[];
  activeSlug?: string;
  showAll?: boolean;
}

// Used on the homepage (no active state, just entry points into /products)
// and on the listing page (activeSlug highlights the current filter).
export function CategoryPills({ categories, activeSlug, showAll = false }: CategoryPillsProps) {
  if (categories.length === 0) return null;

  const pillClass = (isActive: boolean) =>
    `whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      isActive
        ? "border-brand-primary bg-brand-primary text-white"
        : "border-gray-300 text-brand-neutral-dark hover:border-brand-primary hover:text-brand-primary"
    }`;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {showAll && (
        <Link href="/products" className={pillClass(!activeSlug)}>
          All
        </Link>
      )}
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/products?category=${category.slug}`}
          className={pillClass(activeSlug === category.slug)}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
