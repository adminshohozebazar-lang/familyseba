import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

// Shared chrome for every customer-facing page (homepage, listing, detail,
// placeholder pages) — kept separate from the admin (dashboard) layout,
// which has its own nav/logout instead. CartProvider wraps Header too,
// since the header's cart icon needs to read the live item count. CartDrawer
// is rendered once here (fixed-position overlay) so it's available on top
// of every storefront page, not just wherever the cart icon happens to live.
export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-brand-neutral-light">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <CartDrawer />
    </CartProvider>
  );
}
