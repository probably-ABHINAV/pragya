import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BIRTHDAY, diffParts } from "@/lib/countdown";
import { EmberParticles, CandleGlow } from "./EmberParticles";
import { Ornament } from "./Ornament";
import { HiddenHeart } from "./HiddenHeart";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(new Date());
  const [showViratLetter, setShowViratLetter] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = diffParts(BIRTHDAY, now);
  const isBirthday = now >= BIRTHDAY;

  return (
    <section id="hero" data-chapter={1} className="relative min-h-[100svh] bg-harvest grain vignette overflow-hidden flex items-center justify-center px-6 pt-20 pb-16">
      <CandleGlow position="bottom-right" />
      <CandleGlow position="top-left" />
      <EmberParticles />
      <div className="relative z-10 max-w-3xl text-center w-full">
        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4 }}
          className="eyebrow mb-6 flex items-center justify-center gap-2"
        >
          Chapter 1 — PRAGYA 20.0
          <HiddenHeart id={1} message="You are still my favourite notification." className="translate-y-[-1px]" />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.8, ease: "easeOut" }}
          className="relative inline-block mb-8"
        >
          <h1 className="font-display italic text-parchment text-6xl sm:text-8xl md:text-9xl leading-[0.9]">
            Pragya 20.0
          </h1>
          <motion.svg
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.4 }}
            viewBox="0 0 300 12" className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-[80%] h-3 text-gold"
            aria-hidden fill="none"
          >
            <motion.path
              d="M4 6 Q 150 2, 296 8"
              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
            />
          </motion.svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 1 }}
          className="max-w-xl mx-auto text-left space-y-6 text-parchment/80 font-body text-sm sm:text-base mt-8"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="eyebrow text-gold/60">Official Release Date</p>
              <p>31 July 2026</p>
            </div>
            <div>
              <p className="eyebrow text-gold/60">Developer</p>
              <p>Karunya Sharma</p>
            </div>
          </div>

          <div>
            <p className="eyebrow text-gold/60 mb-2">Version Notes</p>
            <ul className="space-y-1">
              <li>✓ More beautiful</li>
              <li>✓ More mature</li>
              <li>✓ Still overthinks sometimes</li>
              <li>✓ Still wins every argument (according to her)</li>
              <li>
                ✓ Still obsessed with{" "}
                <button 
                  onClick={() => setShowViratLetter(true)}
                  className="inline-block relative text-parchment font-medium underline decoration-gold/40 hover:decoration-gold transition-colors"
                >
                  Virat Kohli
                </button>
              </li>
              <li>✓ Still my favourite person</li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gold/60 mb-2">Bug Fixes</p>
            <ul className="space-y-1">
              <li>✓ Reduced self-doubt</li>
              <li>✓ Increased confidence</li>
              <li>✓ Increased cuteness by 200%</li>
            </ul>
          </div>

          <div className="bg-gold/5 border border-gold/10 p-4 rounded-sm">
            <p className="eyebrow text-ember mb-1">Known Issue</p>
            <p>Still doesn't realize how special she is.</p>
          </div>
        </motion.div>

        <AnimatePresence>
          {showViratLetter && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowViratLetter(false)}
            >
              <div 
                className="bg-harvest border border-gold/20 p-8 max-w-sm w-full text-left shadow-2xl relative"
                onClick={e => e.stopPropagation()}
              >
                <p className="font-display italic text-2xl mb-4 text-parchment">Dear Virat,</p>
                <p className="text-parchment/80 font-body mb-4 leading-relaxed">
                  Thank you for inspiring her.
                </p>
                <p className="text-parchment/80 font-body mb-6 leading-relaxed">
                  Now please move aside for five minutes.
                </p>
                <p className="text-parchment/80 font-body">Sincerely,</p>
                <p className="font-display italic text-gold text-xl mt-1">Karunya</p>
                
                <button 
                  onClick={() => setShowViratLetter(false)}
                  className="mt-8 eyebrow text-gold/60 hover:text-gold w-full text-center"
                >
                  Close Letter
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center mt-14 mb-8"><Ornament className="w-40 text-gold/50" /></div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1.4 }}
          className="mt-8 flex flex-col items-center"
        >
          {mounted ? (
            isBirthday ? (
              <div className="text-center font-body text-parchment/80">
                <p className="font-display italic text-2xl sm:text-3xl text-gold mb-4 drop-shadow-md">
                  She turns 20 today.
                </p>
                <p className="mb-6 leading-relaxed">
                  That is 7,305 days, 175,320 hours, and 10,519,200 minutes of life.
                </p>
                <div className="bg-parchment/5 border border-gold/20 p-4 inline-block rounded-sm">
                  <p className="eyebrow text-gold/60 mb-3">Age Breakdown</p>
                  <div className="grid grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="text-gold text-xl sm:text-2xl font-display italic">7,305</p>
                      <p className="eyebrow mt-1 text-parchment/50">Days</p>
                    </div>
                    <div>
                      <p className="text-gold text-xl sm:text-2xl font-display italic">175,320</p>
                      <p className="eyebrow mt-1 text-parchment/50">Hours</p>
                    </div>
                    <div>
                      <p className="text-gold text-xl sm:text-2xl font-display italic">10,519,200</p>
                      <p className="eyebrow mt-1 text-parchment/50">Minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-3 sm:gap-5 md:gap-7 font-display italic text-gold scale-75 sm:scale-100">
                <div className="flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl md:text-6xl tabular-nums leading-none">{String(t.days).padStart(3, "0")}</span>
                  <span className="eyebrow mt-3 text-[10px] sm:text-xs text-parchment/60 uppercase tracking-[0.3em]">Days</span>
                </div>
                <span className="text-3xl sm:text-4xl md:text-5xl text-gold/30 -translate-y-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl md:text-6xl tabular-nums leading-none">{String(t.hours).padStart(2, "0")}</span>
                  <span className="eyebrow mt-3 text-[10px] sm:text-xs text-parchment/60 uppercase tracking-[0.3em]">Hours</span>
                </div>
                <span className="text-3xl sm:text-4xl md:text-5xl text-gold/30 -translate-y-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl md:text-6xl tabular-nums leading-none">{String(t.minutes).padStart(2, "0")}</span>
                  <span className="eyebrow mt-3 text-[10px] sm:text-xs text-parchment/60 uppercase tracking-[0.3em]">Mins</span>
                </div>
                <span className="text-3xl sm:text-4xl md:text-5xl text-gold/30 -translate-y-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl md:text-6xl tabular-nums leading-none">{String(t.seconds).padStart(2, "0")}</span>
                  <span className="eyebrow mt-3 text-[10px] sm:text-xs text-parchment/60 uppercase tracking-[0.3em]">Secs</span>
                </div>
              </div>
            )
          ) : (
            <div className="h-[72px] sm:h-[88px] flex items-center justify-center">
              <span className="text-gold/40 text-lg font-display italic tracking-widest">Calculating time...</span>
            </div>
          )}
        </motion.div>

        <motion.a
          href="#songs"
          initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 2.4, duration: 1 }}
          className="mt-16 inline-block eyebrow hover:text-parchment transition"
        >
          turn the page ↓
        </motion.a>
      </div>
    </section>
  );
}
