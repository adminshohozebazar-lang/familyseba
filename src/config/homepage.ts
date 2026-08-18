// Editable content for the homepage redesign. Nothing here is a database
// model — these are placeholders the store owner edits directly in this
// file until a real admin UI exists for them (banners/testimonials/videos
// don't need one yet per the Phase A scope).

export interface HeroSlide {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

// No real banner photography yet — these render as text-only, brand-colored
// slides until `imageUrl` is filled in.
export const HERO_SLIDES: HeroSlide[] = [
  {
    title: "Herbal Wellness, Delivered to Your Door",
    subtitle: "Trusted natural supplements for everyday health, sourced and packed with care.",
    ctaText: "Shop Now",
    ctaLink: "/products",
  },
  {
    title: "Cash on Delivery, Anywhere in Bangladesh",
    subtitle: "Order now, pay when it arrives — no card or account needed.",
    ctaText: "Browse Products",
    ctaLink: "/products",
  },
  {
    title: "Quality You Can Trust",
    subtitle: "Every product is reviewed for quality before it reaches you.",
    ctaText: "Explore Categories",
    ctaLink: "/products",
  },
];

export interface PromoBanner {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const PROMO_BANNERS: PromoBanner[] = [
  {
    title: "New Arrivals",
    subtitle: "Check out our latest products",
    ctaText: "Shop Now",
    ctaLink: "/products",
  },
  {
    title: "Immunity Boosters",
    subtitle: "Support your health, naturally",
    ctaText: "Explore",
    ctaLink: "/products",
  },
];

export interface Testimonial {
  name: string;
  quote: string;
  rating: number; // 1-5
}

// Clearly placeholder — replace with real customer reviews (and real names)
// before launch. No photos here on purpose; see Testimonials.tsx.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "রহিম উদ্দিন",
    quote: "প্রোডাক্টের মান খুবই ভালো এবং ডেলিভারি সময়মতো পেয়েছি। ধন্যবাদ Family Seba!",
    rating: 5,
  },
  {
    name: "সালমা আক্তার",
    quote: "ক্যাশ অন ডেলিভারি থাকায় অর্ডার করতে কোনো দ্বিধা হয়নি। খুব ভালো অভিজ্ঞতা।",
    rating: 5,
  },
  {
    name: "করিম হোসেন",
    quote: "নিয়মিত এখান থেকে অর্ডার করি। প্রতিবারই প্যাকেজিং আর মান নিয়ে সন্তুষ্ট।",
    rating: 4,
  },
];

// Real product/demo video IDs go here (the part after "v=" in a YouTube
// URL). Left empty until real footage exists — the section simply doesn't
// render when this is empty.
export const VIDEO_GALLERY_IDS: string[] = [];

export interface ContactInfo {
  address: string;
  email: string;
  phone: string;
}

// Placeholder — replace with the real business address/contact details.
export const CONTACT_INFO: ContactInfo = {
  address: "House 12, Road 5, Dhanmondi, Dhaka, Bangladesh",
  email: "support@familyseba.example",
  phone: "+880 1XXXXXXXXX",
};

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
}

// Placeholder "#" links — replace with real profile URLs.
export const SOCIAL_LINKS: SocialLinks = {
  facebook: "#",
  instagram: "#",
  youtube: "#",
};
