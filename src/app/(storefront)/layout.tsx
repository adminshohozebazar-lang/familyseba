import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartProvider } from "@/context/CartContext";

// Shared chrome for every customer-facing page (homepage, listing, detail,
// placeholder pages) — kept separate from the admin (dashboard) layout,
// which has its own nav/logout instead. CartProvider wraps Header too,
// since the header's cart icon needs to read the live item count.
export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-brand-neutral-light">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
