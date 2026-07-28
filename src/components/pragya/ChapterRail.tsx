import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useProgress } from "@/hooks/useProgress";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const chapters = [
  { id: "hero", label: "Until You" },

  { id: "songs", label: "Our Songs" },
  { id: "story", label: "Our Story" },
  { id: "vault", label: "Memory Vault" },
  { id: "film", label: "The Film" },
  { id: "letters", label: "Letters" },
  { id: "game", label: "Games" },
  { id: "footer", label: "Yours" },
];

export function ChapterRail() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const { visitedChapters, furthestChapterIndex, markChapter } = useProgress();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = chapters.findIndex((c) => c.id === e.target.id);
            if (idx >= 0) {
              setActive(idx);
              markChapter(e.target.id, idx);
            }
          }
        });
      },
      { threshold: 0.4 },
    );
    chapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [markChapter]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // scroll-snap on <html> lands the section flush with the viewport top
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    const focusable = el.querySelector<HTMLElement>("h1, h2, [tabindex]");
    if (focusable) {
      focusable.setAttribute("tabindex", "-1");
      setTimeout(() => focusable.focus({ preventScroll: true }), 400);
    }
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = Math.min(i + 1, chapters.length - 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = Math.max(i - 1, 0);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = chapters.length - 1;
    else return;
    e.preventDefault();
    go(chapters[next].id);
    const btn = document.querySelector<HTMLButtonElement>(`[data-rail-idx="${next}"]`);
    btn?.focus();
  };

  return (
    <>
      {/* Mobile top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-[2px] bg-gold/10 md:hidden" aria-hidden>
        <motion.div
          className="h-full bg-gradient-to-r from-ember to-gold"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Mobile tap-to-jump dot rail — right edge, always visible */}
      <nav
        aria-label="Chapters"
        className="fixed right-2 top-1/2 -translate-y-1/2 z-40 flex md:hidden flex-col items-center gap-3 rounded-full py-3 px-2 backdrop-blur"
        style={{
          background: "linear-gradient(180deg, oklch(0.22 0.08 30 / 0.55), oklch(0.18 0.06 30 / 0.55))",
          border: "1px solid oklch(0.55 0.14 60 / 0.25)",
        }}
      >
        {chapters.map((c, i) => {
          const isActive = active === i;
          const isVisited = !isActive && (visitedChapters.has(c.id) || i <= furthestChapterIndex);
          return (
            <button
              key={c.id}
              data-rail-idx={i}
              onClick={() => go(c.id)}
              aria-label={`Chapter ${ROMAN[i]}: ${c.label}${isVisited ? " (read)" : ""}`}
              aria-current={isActive ? "true" : undefined}
              className="relative w-6 h-6 grid place-items-center"
            >
              <span
                className="block rounded-full transition-all duration-500"
                aria-hidden
                style={
                  isActive
                    ? {
                        width: 10, height: 10, background: "var(--gold)",
                        boxShadow: "0 0 12px oklch(0.82 0.18 70 / 0.9), 0 0 24px oklch(0.72 0.16 55 / 0.5)",
                      }
                    : isVisited
                    ? { width: 6, height: 6, background: "oklch(0.82 0.14 80 / 0.7)" }
                    : { width: 5, height: 5, background: "oklch(0.85 0.05 70 / 0.35)" }
                }
              />
            </button>
          );
        })}
      </nav>

      {/* Desktop labeled rail with a progress line running through the dots */}
      <nav
        aria-label="Chapters"
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-4"
      >
        {/* Vertical progress line behind the dots */}
        <div
          aria-hidden
          className="absolute right-[3px] top-1 bottom-1 w-px bg-parchment/10 rounded-full overflow-hidden"
        >
          <motion.div
            className="w-full origin-top bg-gradient-to-b from-ember to-gold"
            initial={false}
            animate={{
              scaleY: (Math.max(active, furthestChapterIndex) + 0.5) / chapters.length,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ height: "100%", boxShadow: "0 0 8px oklch(0.82 0.18 70 / 0.6)" }}
          />
        </div>

        {chapters.map((c, i) => {
          const isActive = active === i;
          const isVisited = !isActive && (visitedChapters.has(c.id) || i <= furthestChapterIndex);
          return (
            <button
              key={c.id}
              data-rail-idx={i}
              onClick={() => go(c.id)}
              onKeyDown={(e) => onKey(e, i)}
              className="group relative flex items-center gap-3"
              aria-label={`Chapter ${ROMAN[i]}: ${c.label}${isVisited ? " (read)" : ""}`}
              aria-current={isActive ? "true" : undefined}
            >
              <span
                className={`font-body text-[10px] tracking-[0.35em] uppercase transition-all duration-500 ${
                  isActive
                    ? "text-gold opacity-100"
                    : "text-parchment/40 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
              >
                {ROMAN[i]} — {c.label}
              </span>
              {/* Line + glowing dot at the tip */}
              <span className="relative flex items-center" aria-hidden>
                <span
                  className={`block h-px transition-all duration-500 ${
                    isActive
                      ? "w-10 bg-gold"
                      : isVisited
                      ? "w-6 bg-gold/50 group-hover:w-8"
                      : "w-4 bg-parchment/30 group-hover:w-6 group-hover:bg-gold/60"
                  }`}
                />
                <span
                  className="absolute -right-1 rounded-full transition-all duration-500"
                  style={
                    isActive
                      ? {
                          width: 8, height: 8, background: "var(--gold)",
                          boxShadow: "0 0 12px oklch(0.82 0.18 70 / 0.9), 0 0 28px oklch(0.72 0.16 55 / 0.55)",
                        }
                      : isVisited
                      ? { width: 6, height: 6, background: "oklch(0.82 0.14 80 / 0.75)" }
                      : { width: 4, height: 4, background: "oklch(0.85 0.05 70 / 0.35)" }
                  }
                />
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
