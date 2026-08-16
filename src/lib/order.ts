// Human-friendly order reference derived from Order.sequence (an internal
// autoincrementing counter — see prisma/schema.prisma). Order ids are
// non-sequential cuids, so they can't be used for this directly.
export function formatOrderNumber(sequence: number): string {
  return `FS-${String(sequence).padStart(6, "0")}`;
}
