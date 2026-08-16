import Link from "next/link";
import { SITE_NAME } from "@/config/site";
import { LogoutButton } from "@/components/admin/LogoutButton";

// Shared shell (nav + logout) for every authenticated admin page. Lives in a
// route group so /admin/login — which must NOT show this chrome — can sit
// outside it while still resolving to the same /admin/* URL space.
export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-neutral-light">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-lg font-bold text-brand-primary">
              {SITE_NAME} Admin
            </Link>
            <nav className="flex gap-4 text-sm font-medium text-brand-neutral-dark">
              <Link href="/admin/categories" className="hover:text-brand-primary">
                Categories
              </Link>
              <Link href="/admin/products" className="hover:text-brand-primary">
                Products
              </Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
