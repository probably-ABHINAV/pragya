import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart } from "lucide-react";
import { Ornament } from "./Ornament";

export function Footer() {
  const [hearts, setHearts] = useState<number[]>([]);
  const burst = () => {
    const id = Date.now();
    setHearts((h) => [...h, id]);
    setTimeout(() => setHearts((h) => h.filter((x) => x !== id)), 3500);
  };
  return (
    <footer id="footer" data-chapter={8} className="relative py-32 px-6 text-center">
      <div className="flex justify-center mb-8"><Ornament className="w-56 text-gold/50" /></div>
      <p className="font-display italic text-parchment text-4xl sm:text-5xl leading-tight">
        for pragya —<br />
        <span className="text-gold">always, yours.</span>
      </p>
      <p className="mt-8 eyebrow">a private edition of one</p>
      <button
        onClick={burst}
        className="mt-16 inline-block text-gold/25 hover:text-ember transition"
        aria-label="a small secret"
      >
        <Heart className="w-3 h-3" />
      </button>

      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        <AnimatePresence>
          {hearts.map((id) => (
            <motion.div key={id} className="absolute inset-0" aria-hidden>
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 0, x: 0, scale: 0.4 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -(400 + Math.random() * 300),
                    x: (Math.random() - 0.5) * 400,
                    scale: 0.6 + Math.random() * 1.2,
                    rotate: (Math.random() - 0.5) * 120,
                  }}
                  transition={{ duration: 2.6 + Math.random() * 0.8, ease: "easeOut", delay: i * 0.04 }}
                  className="absolute left-1/2 bottom-32"
                >
                  <Heart className="w-6 h-6 text-ember fill-ember/70" />
                </motion.div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </footer>
  );
}
