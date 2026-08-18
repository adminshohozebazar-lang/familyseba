function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6 shrink-0" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v9H3V7Zm11 3h4l3 3v3h-7v-6Z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6 shrink-0" aria-hidden="true">
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path strokeLinecap="round" d="M6 9v.01M18 15v.01" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6 shrink-0" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  );
}

const BADGES = [
  { icon: <TruckIcon />, label: "Fast Delivery", subtext: "Delivered within 2-4 business days" },
  { icon: <CashIcon />, label: "Cash on Delivery", subtext: "Pay when your order arrives" },
  { icon: <ShieldIcon />, label: "Quality Guarantee", subtext: "Every product checked before shipping" },
];

export function TrustBadges() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-3">
      {BADGES.map((badge) => (
        <div key={badge.label} className="flex items-start gap-3">
          <div className="text-brand-primary">{badge.icon}</div>
          <div>
            <p className="text-sm font-semibold text-brand-neutral-dark">{badge.label}</p>
            <p className="text-xs text-gray-500">{badge.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
