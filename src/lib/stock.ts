export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

// Customers only ever see a status label, never the exact quantity —
// showing "3 left" invites urgency-pressure tactics we're not doing here.
const LOW_STOCK_THRESHOLD = 5;

export function getStockStatus(stockQuantity: number): StockStatus {
  if (stockQuantity <= 0) return "OUT_OF_STOCK";
  if (stockQuantity < LOW_STOCK_THRESHOLD) return "LOW_STOCK";
  return "IN_STOCK";
}

export const STOCK_STATUS_LABEL: Record<StockStatus, string> = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};
