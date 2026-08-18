"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { HeroSlide } from "@/config/homepage";

const AUTO_ADVANCE_MS = 5000;

interface HeroCarouselProps {
  slides: HeroSlide[];
}

// Text-only, brand-colored slides until real banner photography exists —
// see src/config/homepage.ts. Auto-advances but pauses implicitly whenever
// the user interacts (the interval just gets reset on manual navigation).
export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides.length, index]);

  if (slides.length === 0) return null;

  const slide = slides[index];

  return (
    <div className="relative flex h-72 items-center justify-center overflow-hidden bg-brand-primary px-4 text-center text-white sm:h-80 md:h-96">
      {slide.imageUrl && (
        <Image src={slide.imageUrl} alt={slide.title} fill priority={index === 0} className="object-cover" />
      )}

      <div className={`relative z-10 ${slide.imageUrl ? "rounded-lg bg-black/30 px-6 py-8" : ""}`}>
        <h1 className="text-2xl font-bold sm:text-4xl">{slide.title}</h1>
        {slide.subtitle && (
          <p className="mx-auto mt-3 max-w-md text-brand-neutral-light/90">{slide.subtitle}</p>
        )}
        {slide.ctaText && slide.ctaLink && (
          <Link
            href={slide.ctaLink}
            className="mt-6 inline-block rounded-md bg-brand-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-accent/90"
          >
            {slide.ctaText}
          </Link>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-lg hover:bg-white/30"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-lg hover:bg-white/30"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
