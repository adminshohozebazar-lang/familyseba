"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

// The main interactive piece of the product detail page. Hover-zoom is
// plain CSS (scale on hover, clipped by the overflow-hidden wrapper);
// tapping/clicking opens a full-screen lightbox, which covers touch
// devices where hover doesn't apply. No carousel library needed for either.
export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
        No image available
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsZoomed(true)}
        aria-label="View full-size image"
        className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg bg-gray-100"
      >
        <Image
          src={images[selectedIndex]}
          alt={alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          priority
        />
      </button>

      {/* Only products with more than one image get a thumbnail strip —
          a strip with a single, unclickable thumbnail would just be noise. */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Show image ${index + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                index === selectedIndex ? "border-brand-primary" : "border-transparent"
              }`}
            >
              <Image src={image} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — full size`}
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <button
            type="button"
            onClick={() => setIsZoomed(false)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xl text-white hover:bg-white/30"
          >
            ×
          </button>
          <div className="relative h-full w-full max-w-2xl">
            <Image src={images[selectedIndex]} alt={alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
