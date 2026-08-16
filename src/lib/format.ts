// Prisma returns money fields as Decimal instances; accepting `unknown`
// here (via Number()) keeps callers from needing to import the Decimal type
// just to format a price.
export function formatPrice(price: number | string | { toString(): string }): string {
  return `৳${Number(price).toFixed(2)}`;
}
