import type { Testimonial } from "@/config/homepage";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-brand-accent" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden="true">
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

// First letters of up to two words — used for the placeholder avatar circle
// instead of a photo (see src/config/homepage.ts for why).
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="mb-6 text-xl font-bold text-brand-neutral-dark">What Our Customers Say</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="w-64 shrink-0 rounded-lg border border-gray-200 bg-white p-4 sm:w-auto"
          >
            <StarRating rating={testimonial.rating} />
            <p className="mt-3 text-sm text-brand-neutral-dark">&ldquo;{testimonial.quote}&rdquo;</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
                {getInitials(testimonial.name)}
              </div>
              <span className="text-sm font-medium text-brand-neutral-dark">{testimonial.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
