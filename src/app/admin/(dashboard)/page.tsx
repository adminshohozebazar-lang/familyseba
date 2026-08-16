import Link from "next/link";

// Landing page after login — a simple hub linking into the two managed
// resources. Expands as more admin sections (orders, etc.) are added later.
export default function AdminHomePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-neutral-dark">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/categories"
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-brand-primary"
        >
          <h2 className="text-lg font-semibold text-brand-primary">Categories</h2>
          <p className="mt-1 text-sm text-gray-500">View and create product categories.</p>
        </Link>
        <Link
          href="/admin/products"
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-brand-primary"
        >
          <h2 className="text-lg font-semibold text-brand-primary">Products</h2>
          <p className="mt-1 text-sm text-gray-500">View, create, and edit products.</p>
        </Link>
      </div>
    </div>
  );
}
