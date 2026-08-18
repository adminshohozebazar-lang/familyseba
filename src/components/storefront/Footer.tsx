import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/config/site";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/config/homepage";

// Minimal inline icons so the footer doesn't need an icon library for three
// glyphs. Placeholder "#" hrefs come from SOCIAL_LINKS until real profiles exist.
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.3c-.3-.05-1.2-.13-2.25-.13-2.23 0-3.75 1.36-3.75 3.85V10.5h-2.5v3h2.5V21h3Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M21.6 7.2c-.25-1-1-1.75-2-2C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.6.45c-1 .25-1.75 1-2 2C2 8.9 2 12 2 12s0 3.1.4 4.8c.25 1 1 1.75 2 2 1.7.45 7.6.45 7.6.45s5.9 0 7.6-.45c1-.25 1.75-1 2-2 .4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="text-lg font-bold text-brand-primary">
              {SITE_NAME}
            </Link>
            <p className="mt-2 text-sm text-gray-500">{SITE_TAGLINE}</p>
            <div className="mt-4 flex gap-3 text-gray-400">
              <a href={SOCIAL_LINKS.facebook} aria-label="Facebook" className="hover:text-brand-primary">
                <FacebookIcon />
              </a>
              <a href={SOCIAL_LINKS.instagram} aria-label="Instagram" className="hover:text-brand-primary">
                <InstagramIcon />
              </a>
              <a href={SOCIAL_LINKS.youtube} aria-label="YouTube" className="hover:text-brand-primary">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-neutral-dark">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/about" className="hover:text-brand-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-brand-primary">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-neutral-dark">Support</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/contact" className="hover:text-brand-primary">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-brand-primary">
                  Shipping &amp; Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-neutral-dark">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>{CONTACT_INFO.address}</li>
              <li>
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-brand-primary">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-brand-primary">
                  {CONTACT_INFO.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 text-sm text-gray-500">
          <p className="mb-2">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
          <p className="text-xs text-gray-400">
            {SITE_NAME} sells herbal and wellness supplements. These products are not intended to
            diagnose, treat, cure, or prevent any disease, and are not a substitute for professional
            medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
