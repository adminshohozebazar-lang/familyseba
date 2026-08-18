import { allDistricts, upazilaNamesOf } from "@bangladeshi/bangladesh-address";

// Sorted defensively rather than relying on the package's internal ordering to stay stable across versions.
export function getDistricts(): string[] {
  return [...allDistricts()].sort();
}

export function getThanas(district: string): string[] {
  if (!district) return [];
  return [...upazilaNamesOf(district)].sort();
}
