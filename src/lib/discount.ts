// Shared by anywhere a product's price is shown with an optional strikethrough
// "original" price. Callers pass plain numbers (already converted from
// Prisma's Decimal via Number()), same convention as formatPrice.
export function hasDiscount(price: number, compareAtPrice: number | null): compareAtPrice is number {
  return compareAtPrice !== null && compareAtPrice > price;
}

export function getDiscountPercent(price: number, compareAtPrice: number): number {
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
