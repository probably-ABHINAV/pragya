import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { letters, type Letter } from "@/data/pragya";
import { isUnlocked, daysUntil } from "@/lib/countdown";
import { useProgress } from "@/hooks/useProgress";
import { ChapterFrame, SectionReveal } from "./ChapterFrame";
import { WaxSeal } from "./WaxSeal";
import { LetterOpen } from "./LetterOpen";
import { HiddenHeart } from "./HiddenHeart";

function Envelope({ l, i, opened, onOpen }: { l: Letter; i: number; opened: boolean; onOpen: (l: Letter, e: React.MouseEvent) => void }) {
  const unlocked = isUnlocked(l.unlock_date);
  return (
    <SectionReveal delay={i * 0.08}>
      <motion.button
        onClick={(e) => onOpen(l, e)}
        disabled={!unlocked}
        whileHover={unlocked ? { y: -6, rotateZ: 0.5 } : {}}
        className="group relative w-full aspect-[3/2] disabled:cursor-not-allowed"
        aria-label={unlocked ? `Open letter: ${l.title}` : `Sealed letter: ${l.title}, unlocks 31 July 2026`}
      >
        <div
          className="relative w-full h-full rounded-sm overflow-hidden shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)]"
          style={{ background: "linear-gradient(140deg, oklch(0.42 0.13 45), oklch(0.32 0.11 32))" }}
        >
          <svg viewBox="0 0 200 130" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden>
            <polygon points="0,0 100,70 200,0" fill="oklch(0.36 0.12 40)" opacity="0.8" />
            <line x1="0" y1="0" x2="100" y2="70" stroke="oklch(0.85 0.14 70 / 0.25)" strokeWidth="0.5" />
            <line x1="200" y1="0" x2="100" y2="70" stroke="oklch(0.85 0.14 70 / 0.25)" strokeWidth="0.5" />
          </svg>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:scale-110">
            <WaxSeal initial="P" size={64} />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between">
            <div>
              <p className="eyebrow text-[9px] flex items-center gap-1.5">
                {unlocked ? "Letter" : "Sealed"}
                {opened && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-gold/15 text-gold px-1.5 py-0.5 text-[8px] tracking-[0.2em] normal-case"
                    aria-label="Read"
                  >
                    <Check className="w-2.5 h-2.5" aria-hidden /> read
                  </span>
                )}
              </p>
              <p className="font-display italic text-parchment text-xl sm:text-2xl leading-tight">{l.title}</p>
            </div>
            {!unlocked && (
              <p className="text-parchment/50 text-[9px] uppercase tracking-[0.25em] font-body text-right leading-relaxed">
                opens on<br />31 · 07 · 26<br />({daysUntil(l.unlock_date)}d)
              </p>
            )}
          </div>
        </div>
      </motion.button>
    </SectionReveal>
  );
}

export function Letters() {
  const [open, setOpen] = useState<Letter | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { openedLetters, markLetter } = useProgress();

  const handleOpen = (l: Letter, e: React.MouseEvent) => {
    if (!isUnlocked(l.unlock_date)) return;
    openerRef.current = e.currentTarget as HTMLElement;
    setOpen(l);
    markLetter(l.id);
  };

  const close = () => {
    setOpen(null);
    setTimeout(() => openerRef.current?.focus(), 50);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <ChapterFrame id="letters" index={6} title="Letters, in your name" subtitle="Some things I wrote so I'd never forget to say them.">
      <div className="max-w-4xl mx-auto flex justify-end mb-4 px-4">
        <HiddenHeart id={6} message="I love you. No puzzle. No joke. Just this." />
      </div>

      <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {letters.map((l, i) => <Envelope key={l.id} l={l} i={i} opened={openedLetters.has(l.id)} onOpen={handleOpen} />)}
      </div>

      <AnimatePresence>
        {open && <LetterOpen letter={open} onClose={close} closeRef={closeRef} />}
      </AnimatePresence>
    </ChapterFrame>
  );
}
