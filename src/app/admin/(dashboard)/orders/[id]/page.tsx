import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/format";
import { ORDER_STATUS_LABEL, ORDER_STATUS_BADGE_CLASS } from "@/lib/order-status";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

interface OrderDetailPageProps {
  params: { id: string };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/orders" className="text-sm font-medium text-brand-primary hover:underline">
        ← Back to Orders
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-neutral-dark">{order.orderNumber}</h1>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${ORDER_STATUS_BADGE_CLASS[order.status]}`}>
          {ORDER_STATUS_LABEL[order.status]}
        </span>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-brand-neutral-dark">Customer</h2>
          <p className="text-sm text-gray-600">{order.customerName}</p>
          <p className="text-sm text-gray-600">{order.customerPhone}</p>
          <p className="mt-2 text-sm text-gray-600">{order.customerAddress}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-brand-neutral-dark">Payment</h2>
          <p className="text-sm text-gray-600">Cash on Delivery</p>
          <p className="mt-2 text-sm text-gray-500">Placed {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-brand-neutral-dark">Items</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-gray-500">
            <tr>
              <th className="pb-2">Product</th>
              <th className="pb-2">Qty</th>
              <th className="pb-2">Price</th>
              <th className="pb-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2 text-brand-neutral-dark">{item.product.name}</td>
                <td className="py-2 text-gray-500">{item.quantity}</td>
                <td className="py-2 text-gray-500">{formatPrice(item.priceAtOrder)}</td>
                <td className="py-2 text-right text-gray-500">
                  {formatPrice(Number(item.priceAtOrder) * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-base font-semibold">
          <span className="text-brand-neutral-dark">Total</span>
          <span className="text-brand-primary">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-brand-neutral-dark">Update Status</h2>
        <OrderStatusForm orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  );
}
