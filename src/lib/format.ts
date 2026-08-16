// Prisma returns money fields as Decimal instances; accepting `unknown`
// here (via Number()) keeps callers from needing to import the Decimal type
// just to format a price.
export function formatPrice(price: number | string | { toString(): string }): string {
  return `৳${Number(price).toFixed(2)}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
