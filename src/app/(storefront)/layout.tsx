import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

// Shared chrome for every customer-facing page (homepage, listing, detail,
// placeholder pages) — kept separate from the admin (dashboard) layout,
// which has its own nav/logout instead.
export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-neutral-light">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
