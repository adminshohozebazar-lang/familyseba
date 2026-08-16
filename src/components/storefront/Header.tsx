import Link from "next/link";
import { SITE_NAME } from "@/config/site";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-brand-primary">
          {SITE_NAME}
        </Link>
        <nav className="text-sm font-medium text-brand-neutral-dark">
          <Link href="/products" className="hover:text-brand-primary">
            All Products
          </Link>
        </nav>
      </div>
    </header>
  );
}
