import { useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { letters, type Letter } from "@/data/pragya";
import { isUnlocked, daysUntil } from "@/lib/countdown";
import { useProgress } from "@/hooks/useProgress";
import { ChapterFrame, SectionReveal } from "./ChapterFrame";
import { PhotoOverlay } from "./PhotoOverlay";
import { HiddenHeart } from "./HiddenHeart";

function Polaroid({ l, i, opened, onOpen }: { l: Letter; i: number; opened: boolean; onOpen: (l: Letter, e: React.MouseEvent) => void }) {
  const unlocked = isUnlocked(l.unlock_date);
  
  // Memoize random rotation and offset to keep it stable on re-renders
  const { rotate, yOffset, xOffset } = useMemo(() => {
    // Generate a random rotation between -6 and +6 degrees
    const r = (Math.random() * 12) - 6;
    // Generate a random y offset between -10 and 10 px
    const y = (Math.random() * 20) - 10;
    const x = (Math.random() * 10) - 5;
    return { rotate: r, yOffset: y, xOffset: x };
  }, []);

  return (
    <SectionReveal delay={i * 0.1}>
      <motion.button
        onClick={(e) => onOpen(l, e)}
        disabled={!unlocked}
        whileHover={unlocked ? { scale: 1.05, rotate: 0, zIndex: 20, y: -10 } : {}}
        initial={{ rotate, y: yOffset, x: xOffset }}
        animate={{ rotate, y: yOffset, x: xOffset }}
        className="group relative w-full aspect-[4/5] disabled:cursor-not-allowed bg-parchment p-3 pb-12 sm:p-4 sm:pb-16 shadow-lg hover:shadow-2xl transition-shadow border border-black/5"
        aria-label={unlocked ? `Open photo: ${l.title}` : `Locked photo: ${l.title}, unlocks 31 July 2026`}
      >
        <div className="relative w-full h-full bg-black/10 overflow-hidden border border-black/10 shadow-inner">
          {unlocked && l.image_url ? (
            <img 
              src={l.image_url} 
              alt={l.title} 
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
              <span className="text-black/30 font-display italic text-3xl">?</span>
            </div>
          )}
        </div>
        
        <div className="absolute bottom-2 sm:bottom-4 inset-x-0 px-2 flex justify-center items-center flex-col">
          <p className="font-hand text-lg sm:text-2xl text-[oklch(0.35_0.10_30)] drop-shadow-sm leading-tight text-center line-clamp-1">
            {unlocked ? l.title : "Locked Memory"}
          </p>
          {!unlocked && (
            <p className="text-[oklch(0.35_0.10_30)]/50 text-[8px] uppercase tracking-[0.2em] font-body mt-1">
              opens in {daysUntil(l.unlock_date)}d
            </p>
          )}
        </div>

        {opened && unlocked && (
          <div className="absolute -top-2 -right-2 bg-gold text-white rounded-full p-1 shadow-sm">
            <Check className="w-3 h-3" />
          </div>
        )}
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
    <ChapterFrame id="letters" index={6} title="Memories, in your name" subtitle="Some things I kept so I'd never forget them.">
      <div className="max-w-4xl mx-auto flex justify-end mb-6 px-4">
        <HiddenHeart id={6} message="I love you. No puzzle. No joke. Just this." />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {letters.map((l, i) => (
            <div key={l.id} className="relative z-0 hover:z-10">
              <Polaroid l={l} i={i} opened={openedLetters.has(l.id)} onOpen={handleOpen} />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && <PhotoOverlay letter={open} onClose={close} closeRef={closeRef} />}
      </AnimatePresence>
    </ChapterFrame>
  );
}
