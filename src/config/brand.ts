// Central brand color palette. Kept in sync with the `brand` colors in tailwind.config.ts
// so the same hex values are available outside Tailwind classes (e.g. inline styles, emails, PDFs).
export const BRAND_COLORS = {
  primary: "#1F6B3D",
  accent: "#D97B3F",
  neutralLight: "#FAF9F6",
  neutralDark: "#2B2B2B",
} as const;
