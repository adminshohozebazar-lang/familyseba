"use client";

import { useEffect, useState } from "react";

interface ShareButtonsProps {
  productName: string;
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.3c-.3-.05-1.2-.13-2.25-.13-2.23 0-3.75 1.36-3.75 3.85V10.5h-2.5v3h2.5V21h3Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M18.9 2H22l-7.2 8.3L23 22h-6.6l-5.2-6.8L5.2 22H2l7.7-8.9L1.5 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z" />
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

// The share target is "this exact page", so the URL can only be known in
// the browser — starts empty (matching what the server rendered, so
// hydration doesn't mismatch) and fills in via effect right after mount.
export function ShareButtons({ productName }: ShareButtonsProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  // window.location.href already comes back percent-encoded for any
  // non-ASCII path segment (e.g. a Bengali product slug) — decoding first
  // means encodeURIComponent below runs exactly once. Without this, a
  // Bengali URL gets double-encoded ("%25E0..." instead of "%E0...") and
  // the shared link resolves to nothing.
  const encodedUrl = encodeURIComponent(decodeURIComponent(url));
  const encodedText = encodeURIComponent(productName);

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
  const whatsappHref = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;

  return (
    <div className="mt-4 flex items-center gap-3">
      <span className="text-xs font-medium text-gray-500">Share:</span>
      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="text-gray-400 hover:text-brand-primary"
      >
        <FacebookIcon />
      </a>
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="text-gray-400 hover:text-brand-primary"
      >
        <XIcon />
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="text-gray-400 hover:text-brand-primary"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
