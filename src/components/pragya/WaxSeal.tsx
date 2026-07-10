export function WaxSeal({ initial = "P", size = 44, className = "" }: { initial?: string; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <defs>
        <radialGradient id="wax" cx="35%" cy="35%">
          <stop offset="0%" stopColor="oklch(0.72 0.18 45)" />
          <stop offset="60%" stopColor="oklch(0.5 0.16 35)" />
          <stop offset="100%" stopColor="oklch(0.32 0.12 30)" />
        </radialGradient>
      </defs>
      <g>
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          const r = 42 + Math.sin(i * 2.7) * 3;
          const cx = 50 + Math.cos(a) * r;
          const cy = 50 + Math.sin(a) * r;
          return <circle key={i} cx={cx} cy={cy} r={7 + (i % 3)} fill="url(#wax)" opacity="0.9" />;
        })}
        <circle cx="50" cy="50" r="38" fill="url(#wax)" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="oklch(0.85 0.14 70 / 0.5)" strokeWidth="0.5" />
        <text
          x="50" y="50"
          textAnchor="middle" dominantBaseline="central"
          fontFamily="Cormorant Garamond, serif"
          fontStyle="italic"
          fontSize="34"
          fill="oklch(0.92 0.1 75)"
          opacity="0.85"
        >{initial}</text>
      </g>
    </svg>
  );
}
