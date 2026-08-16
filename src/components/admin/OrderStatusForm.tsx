"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/app/admin/(dashboard)/orders/actions";
import { ORDER_STATUS_TRANSITIONS, ORDER_STATUS_LABEL } from "@/lib/order-status";
import { Button } from "@/components/ui/Button";

interface OrderStatusFormProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusForm({ orderId, currentStatus }: OrderStatusFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextOptions = ORDER_STATUS_TRANSITIONS[currentStatus];

  if (nextOptions.length === 0) {
    return <p className="text-sm text-gray-500">This order is in a final state and can&apos;t be changed.</p>;
  }

  async function handleUpdate(newStatus: OrderStatus) {
    if (newStatus === "CANCELLED" && !window.confirm("Cancel this order and restore its stock?")) {
      return;
    }

    setError(null);
    setIsSubmitting(true);
    const result = await updateOrderStatus({ orderId, newStatus });
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {nextOptions.map((status) => (
          <Button
            key={status}
            type="button"
            variant={status === "CANCELLED" ? "danger" : "primary"}
            disabled={isSubmitting}
            onClick={() => handleUpdate(status)}
          >
            Mark as {ORDER_STATUS_LABEL[status]}
          </Button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
