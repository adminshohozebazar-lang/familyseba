import { CartContents } from "@/components/cart/CartContents";

// Kept as a real page (rather than redirecting to "/" with the drawer
// auto-opened) — the drawer/page share the same CartContents component, so
// this costs almost nothing to keep, and it's the more robust fallback for
// a direct link, a bookmark, or a no-JS visit. Server Component: all the
// interactivity lives in CartContents.
export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-brand-neutral-dark">Your Cart</h1>
      <CartContents />
    </div>
  );
}
