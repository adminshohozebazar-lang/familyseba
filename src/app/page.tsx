import { SITE_NAME, SITE_TAGLINE } from "@/config/site";

// Temporary placeholder homepage — confirms Tailwind and the brand theme are wired up
// correctly. Will be replaced by the real storefront homepage in a later step.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-neutral-light px-4 text-center">
      <h1 className="text-4xl font-bold text-brand-primary">{SITE_NAME}</h1>
      <p className="mt-3 text-lg text-brand-neutral-dark">{SITE_TAGLINE}</p>
      <p className="mt-8 rounded-full bg-brand-accent px-4 py-2 text-sm font-medium text-white">
        Site under construction
      </p>
    </main>
  );
}
