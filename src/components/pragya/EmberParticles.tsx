import { useEffect, useRef } from "react";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

// Ember particles — warmer, larger, softer than hearts
export function EmberParticles({ count = 24 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      const size = 3 + Math.random() * 8;
      const delay = Math.random() * 20;
      const dur = 22 + Math.random() * 24;
      const left = Math.random() * 100;
      const drift = (Math.random() * 100 - 50) + "px";
      const hue = 45 + Math.random() * 30;
      s.style.cssText = `position:absolute;left:${left}%;bottom:-40px;width:${size}px;height:${size}px;--drift:${drift};animation:ember-rise ${dur}s ${delay}s linear infinite;opacity:0;border-radius:9999px;background:radial-gradient(circle, oklch(0.85 0.16 ${hue} / 0.9), oklch(0.65 0.15 ${hue} / 0.4) 60%, transparent);box-shadow:0 0 ${size * 3}px oklch(0.75 0.16 ${hue} / 0.6);`;
      el.appendChild(s);
    }
  }, [count]);
  return <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden />;
}

// Candle glow — big soft warm light in a corner
export function CandleGlow({ position = "bottom-right" }: { position?: "bottom-right" | "top-left" }) {
  const pos = position === "bottom-right" ? "bottom-0 right-0" : "top-0 left-0";
  return (
    <div
      className={`pointer-events-none absolute ${pos} w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] animate-candle`}
      style={{
        background: "radial-gradient(circle at center, oklch(0.78 0.16 55 / 0.35), oklch(0.6 0.14 45 / 0.15) 40%, transparent 70%)",
        transform: "translate(20%, 20%)",
      }}
      aria-hidden
    />
  );
}

export { ROMAN };
