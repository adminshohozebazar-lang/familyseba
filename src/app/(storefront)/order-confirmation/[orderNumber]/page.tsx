import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

interface OrderConfirmationPageProps {
  params: { orderNumber: string };
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <h1 className="text-2xl font-bold text-brand-primary">Thank you, {order.customerName}!</h1>
        <p className="mt-2 text-sm text-gray-500">
          Your order <span className="font-semibold text-brand-neutral-dark">{order.orderNumber}</span> has
          been received.
        </p>
        <p className="mt-4 text-sm text-brand-neutral-dark">
          We&apos;ll call you at <strong>{order.customerPhone}</strong> shortly to confirm your order before
          it&apos;s dispatched for delivery.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-brand-neutral-dark">Order Details</h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span className="text-brand-neutral-dark">
                {item.product.name} × {item.quantity}
              </span>
              <span className="shrink-0 text-gray-500">
                {formatPrice(Number(item.priceAtOrder) * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-base font-semibold">
          <span className="text-brand-neutral-dark">Total</span>
          <span className="text-brand-primary">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-2 text-sm font-semibold text-brand-neutral-dark">Delivery Address</h2>
        <p className="text-sm text-gray-600">{order.customerAddress}</p>
        <p className="mt-3 text-sm text-gray-600">Payment: Cash on Delivery</p>
      </div>
    </div>
  );
}
