import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ornament } from "./Ornament";

const KEY = "fp:unlocked";
const PASS = "pragya";

export function PassphraseGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setUnlocked(typeof window !== "undefined" && localStorage.getItem(KEY) === "1");
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASS) {
      localStorage.setItem(KEY, "1");
      setTimeout(() => setUnlocked(true), 200);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  };

  return (
    <>
      {unlocked && children}
      <AnimatePresence>
        {unlocked === false && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-harvest grain vignette flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="relative z-10 max-w-md w-full text-center"
            >
              <p className="eyebrow mb-8">A private letter</p>
              <h1 className="font-display italic text-6xl sm:text-7xl text-parchment leading-none mb-6">
                for someone
              </h1>
              <div className="flex justify-center mb-10">
                <Ornament className="w-32 text-gold/70" />
              </div>
              <p className="text-parchment/60 text-sm mb-8 font-body italic">
                Whisper the name only you would guess.
              </p>
              <form onSubmit={submit} className="flex flex-col gap-4">
                <motion.input
                  animate={error ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  autoFocus
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="…"
                  className="bg-transparent border-b border-gold/40 text-parchment text-center text-2xl font-display italic py-3 focus:outline-none focus:border-gold placeholder:text-parchment/20"
                />
                <button
                  type="submit"
                  className="ember-outline rounded-sm px-8 py-3 text-[10px] tracking-[0.35em] uppercase mt-4 self-center font-body"
                >
                  Enter
                </button>
                {error && <p className="text-destructive text-xs mt-2 font-body">not quite. try again.</p>}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
