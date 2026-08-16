import Link from "next/link";
import { SITE_NAME } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-500">
        <nav className="mb-4 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/about" className="hover:text-brand-primary">
            About
          </Link>
          <Link href="/contact" className="hover:text-brand-primary">
            Contact
          </Link>
          <Link href="/return-policy" className="hover:text-brand-primary">
            Return Policy
          </Link>
        </nav>
        <p className="mb-2">
          &copy; {new Date().getFullYear()} {SITE_NAME}
        </p>
        <p className="text-xs text-gray-400">
          {SITE_NAME} sells herbal and wellness supplements. These products are not intended to
          diagnose, treat, cure, or prevent any disease, and are not a substitute for professional
          medical advice.
        </p>
      </div>
    </footer>
  );
}
