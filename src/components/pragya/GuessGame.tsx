import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";
import { gameQuestions } from "@/data/pragya";
import { ChapterFrame, SectionReveal } from "./ChapterFrame";

function shuffle<T>(a: T[]): T[] {
  return [...a].sort(() => Math.random() - 0.5);
}

const EMBER = ["#e8b84a", "#d4842a", "#9b4423", "#f4e4c1"];

export function GuessGame() {
  const [i, setI] = useState(0);
  const q = gameQuestions[i];
  const options = useMemo(() => shuffle([q.correct_location, ...q.wrong_options]), [q]);
  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked === q.correct_location;

  const pick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === q.correct_location) {
      confetti({
        particleCount: 100, spread: 110, origin: { y: 0.6 },
        colors: EMBER, shapes: ["circle", "square"] as ("circle" | "square")[], scalar: 1.15,
      });
    }
  };

  const next = () => { setPicked(null); setI((n) => (n + 1) % gameQuestions.length); };

  return (
    <ChapterFrame id="game" index={7} title="Guess where this was taken" subtitle="A tiny game. Right answers unfold a secret.">
      <SectionReveal>
        <div className="max-w-2xl mx-auto">
          {/* Polaroid */}
          <div className="flex justify-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: -2 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="p-3 pb-14 bg-parchment/95 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] max-w-md w-full"
              style={{ transform: "rotate(-2deg)" }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={q.photo_url} alt="" className="w-full h-full object-cover grayscale-[0.1]" />
              </div>
              <p className="mt-4 font-hand text-[oklch(0.32_0.10_30)] text-center text-lg">where were we?</p>
            </motion.div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {options.map((opt) => {
              const isPicked = picked === opt;
              const isCorrect = opt === q.correct_location;
              const state = !picked ? "idle" : isCorrect ? "correct" : isPicked ? "wrong" : "dim";
              return (
                <button
                  key={opt}
                  onClick={() => pick(opt)}
                  disabled={!!picked}
                  className={`relative text-left rounded-sm px-5 py-4 border font-body text-sm transition
                    ${state === "idle" ? "border-gold/25 text-parchment hover:bg-ember/10 hover:border-ember/60" : ""}
                    ${state === "correct" ? "border-ember bg-ember/20 text-parchment" : ""}
                    ${state === "wrong" ? "border-destructive/50 text-parchment/70" : ""}
                    ${state === "dim" ? "border-border/40 text-parchment/40" : ""}
                  `}
                >
                  <span className="font-display italic text-lg">{opt}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {picked && (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-10 text-center"
              >
                {correct ? (
                  <div className="inline-block max-w-lg px-8 py-6 bg-parchment text-[oklch(0.32_0.10_30)] shadow-2xl relative"
                       style={{ clipPath: "polygon(3% 8%, 97% 2%, 100% 92%, 4% 98%)" }}>
                    <p className="eyebrow mb-3 text-[oklch(0.5_0.14_40)]">a hidden note</p>
                    <p className="font-display italic text-xl sm:text-2xl leading-snug">{q.hidden_note}</p>
                  </div>
                ) : (
                  <p className="font-display italic text-2xl text-parchment/70">so close. try again?</p>
                )}
                <div className="mt-6">
                  <button onClick={next} className="ember-outline rounded-sm px-6 py-2 text-[10px] uppercase tracking-[0.35em] font-body">
                    next
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SectionReveal>
    </ChapterFrame>
  );
}
