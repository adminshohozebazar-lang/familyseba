import { CONTACT_INFO, WHATSAPP_NUMBER } from "@/config/homepage";

interface ContactButtonsProps {
  productName: string;
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4 w-4" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 4h3l1.5 4L7.5 9.5a12 12 0 0 0 7 7L16 14.5l4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.6.8-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.2.2-.4s0-.3 0-.4c0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1.1 2.8.1.2 1.9 2.9 4.6 4a15.6 15.6 0 0 0 1.5.6c.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1s.2-1 .1-1.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

// Numbers come from config, never hardcoded here, so the store owner can
// update them in one place (src/config/homepage.ts).
export function ContactButtons({ productName }: ContactButtonsProps) {
  const telHref = `tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`;
  const message = encodeURIComponent(`Hi, I'm interested in ordering ${productName}`);
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
      <a
        href={telHref}
        className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-brand-neutral-dark hover:border-brand-primary hover:text-brand-primary"
      >
        <PhoneIcon />
        Call for Order
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 rounded-md border border-green-600 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50"
      >
        <WhatsAppIcon />
        Order via WhatsApp
      </a>
    </div>
  );
}
