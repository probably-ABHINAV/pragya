export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 12" className={className} aria-hidden fill="none">
      <line x1="0" y1="6" x2="88" y2="6" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="112" y1="6" x2="200" y2="6" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <path d="M100 1 L106 6 L100 11 L94 6 Z" stroke="currentColor" strokeWidth="0.7" fill="none" />
      <circle cx="100" cy="6" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function OrnamentLarge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 40" className={className} aria-hidden fill="none">
      <line x1="0" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <line x1="150" y1="20" x2="240" y2="20" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <g transform="translate(120 20)">
        <path d="M0 -14 C 8 -6, 8 6, 0 14 C -8 6, -8 -6, 0 -14 Z" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.9" />
        <circle r="2" fill="currentColor" />
        <circle r="10" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.4" />
      </g>
    </svg>
  );
}
