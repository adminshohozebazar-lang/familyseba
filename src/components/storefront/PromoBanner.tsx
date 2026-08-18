import Link from "next/link";
import Image from "next/image";
import type { PromoBanner as PromoBannerConfig } from "@/config/homepage";

interface PromoBannerProps {
  banner: PromoBannerConfig;
}

// Smaller, static sibling to HeroCarousel — same config-driven,
// text-falls-back-when-no-image approach, just no auto-advance/arrows.
export function PromoBanner({ banner }: PromoBannerProps) {
  return (
    <Link
      href={banner.ctaLink ?? "/products"}
      className="relative flex h-32 items-center justify-center overflow-hidden rounded-lg bg-brand-accent px-4 text-center text-white sm:h-40"
    >
      {banner.imageUrl && <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />}
      <div className={`relative z-10 ${banner.imageUrl ? "rounded bg-black/30 px-4 py-2" : ""}`}>
        <p className="font-semibold">{banner.title}</p>
        {banner.subtitle && <p className="mt-1 text-xs text-white/90">{banner.subtitle}</p>}
        {banner.ctaText && <p className="mt-2 text-xs font-medium underline">{banner.ctaText}</p>}
      </div>
    </Link>
  );
}
