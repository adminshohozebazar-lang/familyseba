import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { ALL_ORDER_STATUSES, ORDER_STATUS_LABEL } from "@/lib/order-status";

// Landing page after login — status counts (especially PENDING, the
// actionable queue) and delivered revenue, each linking straight into the
// filtered order list, plus entry points into categories/products.
export default async function AdminHomePage() {
  const [statusCounts, deliveredRevenue] = await Promise.all([
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.order.aggregate({ where: { status: "DELIVERED" }, _sum: { totalAmount: true } }),
  ]);

  const countsByStatus: Record<OrderStatus, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    RETURNED: 0,
    CANCELLED: 0,
  };
  for (const row of statusCounts) {
    countsByStatus[row.status] = row._count._all;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-neutral-dark">Dashboard</h1>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Orders</h2>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {ALL_ORDER_STATUSES.map((status) => (
          <Link
            key={status}
            href={`/admin/orders?status=${status}`}
            className={`rounded-lg border bg-white p-4 hover:border-brand-primary ${
              status === "PENDING" ? "border-brand-accent" : "border-gray-200"
            }`}
          >
            <p className="text-2xl font-bold text-brand-neutral-dark">{countsByStatus[status]}</p>
            <p className="text-sm text-gray-500">{ORDER_STATUS_LABEL[status]}</p>
          </Link>
        ))}
      </div>
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-2xl font-bold text-brand-primary">
          {formatPrice(deliveredRevenue._sum.totalAmount ?? 0)}
        </p>
        <p className="text-sm text-gray-500">Total Revenue (Delivered)</p>
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Catalog</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/categories"
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-brand-primary"
        >
          <h3 className="text-lg font-semibold text-brand-primary">Categories</h3>
          <p className="mt-1 text-sm text-gray-500">View and create product categories.</p>
        </Link>
        <Link
          href="/admin/products"
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-brand-primary"
        >
          <h3 className="text-lg font-semibold text-brand-primary">Products</h3>
          <p className="mt-1 text-sm text-gray-500">View, create, and edit products.</p>
        </Link>
      </div>
    </div>
  );
}
