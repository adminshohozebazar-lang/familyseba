import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/format";
import { ALL_ORDER_STATUSES, ORDER_STATUS_LABEL, ORDER_STATUS_BADGE_CLASS } from "@/lib/order-status";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface OrdersPageProps {
  searchParams: { status?: string; phone?: string };
}

function isOrderStatus(value: string): value is OrderStatus {
  return (ALL_ORDER_STATUSES as string[]).includes(value);
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const status = searchParams.status && isOrderStatus(searchParams.status) ? searchParams.status : undefined;
  const phone = searchParams.phone?.trim();

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      // startsWith (not contains) so this can actually use the customerPhone
      // index from Step 2 — a customer calling in reads their number left to
      // right, so prefix search covers the real workflow.
      ...(phone ? { customerPhone: { startsWith: phone } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  function buildTabHref(tabStatus: OrderStatus | "ALL") {
    const params = new URLSearchParams();
    if (tabStatus !== "ALL") params.set("status", tabStatus);
    if (phone) params.set("phone", phone);
    const query = params.toString();
    return query ? `/admin/orders?${query}` : "/admin/orders";
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-neutral-dark">Orders</h1>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {(["ALL", ...ALL_ORDER_STATUSES] as const).map((tabStatus) => (
          <Link
            key={tabStatus}
            href={buildTabHref(tabStatus)}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              (tabStatus === "ALL" && !status) || tabStatus === status
                ? "border-brand-primary bg-brand-primary text-white"
                : "border-gray-300 text-brand-neutral-dark hover:border-brand-primary hover:text-brand-primary"
            }`}
          >
            {tabStatus === "ALL" ? "All" : ORDER_STATUS_LABEL[tabStatus]}
          </Link>
        ))}
      </div>

      <form action="/admin/orders" method="GET" className="mb-6 flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <Input name="phone" placeholder="Search by phone number..." defaultValue={phone ?? ""} className="max-w-xs" />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-primary hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-brand-neutral-dark">{order.customerName}</td>
                <td className="px-4 py-3 text-gray-500">{order.customerPhone}</td>
                <td className="px-4 py-3 text-gray-500">{order._count.items}</td>
                <td className="px-4 py-3 text-gray-500">{formatPrice(order.totalAmount)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${ORDER_STATUS_BADGE_CLASS[order.status]}`}
                  >
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
