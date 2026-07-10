import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useProgress } from "@/hooks/useProgress";

const CHAPTERS = [
  { id: "hero", label: "Until You" },
  { id: "daily", label: "Daily Notes" },
  { id: "songs", label: "Our Songs" },
  { id: "story", label: "Our Story" },
  { id: "vault", label: "Memory Vault" },
  { id: "letters", label: "Letters" },
  { id: "game", label: "One Small Game" },
  { id: "footer", label: "Yours" },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

/**
 * Small pill in the bottom-left showing the current chapter, roman numeral,
 * and a gold progress line reflecting the furthest chapter reached.
 */
export function ProgressHUD() {
  const { furthestChapterIndex } = useProgress();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = CHAPTERS.findIndex((c) => c.id === e.target.id);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { threshold: 0.5 },
    );
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const furthest = Math.max(active, furthestChapterIndex);
  const pct = ((furthest + 1) / CHAPTERS.length) * 100;

  return (
    <div
      className="fixed left-4 bottom-4 md:left-6 md:bottom-6 z-30 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className="pointer-events-auto flex flex-col gap-2 rounded-full px-4 py-2 backdrop-blur"
        style={{
          background: "linear-gradient(135deg, oklch(0.28 0.10 35 / 0.75), oklch(0.20 0.06 30 / 0.75))",
          border: "1px solid oklch(0.85 0.14 70 / 0.25)",
          boxShadow: "0 10px 30px -15px oklch(0.7 0.16 55 / 0.5)",
        }}
      >
        <div className="flex items-baseline gap-2">
          <span className="font-body text-[9px] tracking-[0.35em] uppercase text-gold">
            Chapter {ROMAN[active]}
          </span>
          <span className="font-display italic text-parchment text-sm truncate max-w-[10rem]">
            {CHAPTERS[active].label}
          </span>
          <span className="font-body text-[9px] tabular-nums text-parchment/50 ml-auto">
            {active + 1}/{CHAPTERS.length}
          </span>
        </div>
        <div className="h-[2px] w-full rounded-full bg-parchment/10 overflow-hidden" aria-hidden>
          <motion.div
            className="h-full bg-gradient-to-r from-ember to-gold"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              boxShadow: "0 0 8px oklch(0.82 0.18 70 / 0.7)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
