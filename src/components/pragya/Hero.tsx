import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BIRTHDAY, diffParts, todayLong } from "@/lib/countdown";
import { dailyMessages } from "@/data/pragya";
import { EmberParticles, CandleGlow } from "./EmberParticles";
import { Ornament } from "./Ornament";

function numberToWords(n: number): string {
  if (n === 0) return "zero";
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const scales = [["", 1], ["thousand", 1000], ["million", 1_000_000]] as const;
  function chunk(x: number): string {
    if (x < 20) return ones[x];
    if (x < 100) return tens[Math.floor(x / 10)] + (x % 10 ? "-" + ones[x % 10] : "");
    return ones[Math.floor(x / 100)] + " hundred" + (x % 100 ? " " + chunk(x % 100) : "");
  }
  let parts: string[] = [];
  for (let i = scales.length - 1; i >= 0; i--) {
    const [name, size] = scales[i];
    const q = Math.floor(n / size);
    if (q > 0) { parts.push(chunk(q) + (name ? " " + name : "")); n -= q * size; }
  }
  return parts.join(" ");
}

export function Hero() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const t = diffParts(BIRTHDAY, now);
  const msg = dailyMessages[Math.floor(now.getTime() / 86400000) % dailyMessages.length];

  return (
    <section id="hero" data-chapter={1} className="relative min-h-[100svh] bg-harvest grain vignette overflow-hidden flex items-center justify-center px-6 pt-20 pb-16">
      <CandleGlow position="bottom-right" />
      <CandleGlow position="top-left" />
      <EmberParticles />
      <div className="relative z-10 max-w-3xl text-center w-full">
        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4 }}
          className="eyebrow mb-6"
        >
          Chapter I — Until You
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.8, ease: "easeOut" }}
          className="relative inline-block mb-4"
        >
          <h1 className="font-display italic text-parchment text-[24vw] sm:text-9xl md:text-[11rem] leading-[0.9]">
            Pragya
          </h1>
          <motion.svg
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.4 }}
            viewBox="0 0 300 12" className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-[80%] h-3 text-gold"
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
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1.4 }}
          className="mt-12"
        >
          <p className="font-display italic text-parchment text-2xl sm:text-3xl md:text-4xl leading-snug tracking-wide">
            <span className="text-gold tabular-nums">{numberToWords(t.days)}</span> days,
            <span className="text-gold tabular-nums"> {numberToWords(t.hours)}</span> hours,
            <br className="hidden sm:block" />
            <span className="text-gold tabular-nums"> {numberToWords(t.minutes)}</span> minutes
            <span className="text-parchment/70"> until you</span>
          </p>
          <p className="mt-4 font-mono text-parchment/40 text-xs tracking-widest tabular-nums">
            {String(t.days).padStart(3, "0")}:{String(t.hours).padStart(2, "0")}:{String(t.minutes).padStart(2, "0")}:{String(t.seconds).padStart(2, "0")}
            <span className="ml-3 uppercase tracking-[0.3em] text-[10px]">31 · 07 · 2026</span>
          </p>
        </motion.div>

        <div className="flex justify-center mt-14 mb-8"><Ornament className="w-40 text-gold/50" /></div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 1 }}
          className="max-w-md mx-auto"
        >
          <p className="eyebrow mb-4">{todayLong(now)}</p>
          <p className="font-display italic text-parchment text-2xl sm:text-3xl leading-snug drop-cap text-left">
            {msg}
          </p>
        </motion.div>

        <motion.a
          href="#daily"
          initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 2.4, duration: 1 }}
          className="mt-16 inline-block eyebrow hover:text-parchment transition"
        >
          turn the page ↓
        </motion.a>
      </div>
    </section>
  );
}
