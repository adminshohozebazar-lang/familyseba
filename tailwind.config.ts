import type { Config } from "tailwindcss";

// Brand palette lives here (Tailwind theme) and is mirrored in src/config/brand.ts
// so the same hex values are available to non-Tailwind contexts (e.g. inline styles, emails).
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1F6B3D",
          accent: "#D97B3F",
          "neutral-light": "#FAF9F6",
          "neutral-dark": "#2B2B2B",
        },
      },
    },
  },
  plugins: [],
};

export default config;
