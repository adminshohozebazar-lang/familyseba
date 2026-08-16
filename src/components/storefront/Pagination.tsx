import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export function Pagination({ currentPage, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-center gap-4 text-sm">
      {currentPage > 1 ? (
        <Link href={buildHref(currentPage - 1)} className="font-medium text-brand-primary hover:underline">
          ← Previous
        </Link>
      ) : (
        <span className="text-gray-300">← Previous</span>
      )}
      <span className="text-gray-500">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link href={buildHref(currentPage + 1)} className="font-medium text-brand-primary hover:underline">
          Next →
        </Link>
      ) : (
        <span className="text-gray-300">Next →</span>
      )}
    </nav>
  );
}
