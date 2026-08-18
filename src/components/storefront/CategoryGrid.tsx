import Link from "next/link";
import Image from "next/image";

interface CategoryGridProps {
  categories: { slug: string; name: string; iconUrl: string | null }[];
}

// Replaces the text-pill category nav on the homepage with icon cards.
// Categories without an iconUrl fall back to a colored letter avatar rather
// than showing a broken/missing image.
export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
      {categories.map((category) => (
        <Link key={category.slug} href={`/products?category=${category.slug}`} className="flex flex-col items-center gap-2 text-center">
          {category.iconUrl ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-100 sm:h-20 sm:w-20">
              <Image src={category.iconUrl} alt={category.name} fill sizes="80px" className="object-cover" />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-xl font-bold text-white sm:h-20 sm:w-20">
              {category.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xs font-medium text-brand-neutral-dark sm:text-sm">{category.name}</span>
        </Link>
      ))}
    </div>
  );
}
