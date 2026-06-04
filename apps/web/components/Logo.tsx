type Props = {
  size?: number;
  className?: string;
};

// LiftTrack mark — barbell motif on teal→orange gradient (brand pair).
export function Logo({ size = 28, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lt-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#lt-grad)" />
      {/* Barbell — center bar */}
      <rect x="11" y="19" width="18" height="2.5" rx="1.25" fill="#fff" />
      {/* Left plate stack */}
      <rect x="7" y="14" width="3" height="12" rx="1" fill="#fff" />
      <rect x="4" y="16.5" width="2" height="7" rx="1" fill="#fff" fillOpacity="0.85" />
      {/* Right plate stack */}
      <rect x="30" y="14" width="3" height="12" rx="1" fill="#fff" />
      <rect x="34" y="16.5" width="2" height="7" rx="1" fill="#fff" fillOpacity="0.85" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="font-bold tracking-tight">Lift</span>
      <span className="font-bold tracking-tight text-brand">Track</span>
    </span>
  );
}
