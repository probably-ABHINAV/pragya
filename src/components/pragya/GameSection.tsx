import { useState } from "react";
import { ChapterFrame } from "./ChapterFrame";
import { GuessGame } from "./GuessGame";
import { MemoryMatch } from "./MemoryMatch";
import { motion, AnimatePresence } from "motion/react";

export function GameSection() {
  const [activeTab, setActiveTab] = useState<"guess" | "memory">("guess");

  return (
    <ChapterFrame id="game" index={7} title="A Few Small Games" subtitle="Right answers unfold a secret. Every memory is a match.">
      <div className="max-w-4xl mx-auto flex justify-center mb-12">
        <div className="flex bg-parchment/10 p-1 rounded-sm border border-gold/20">
          <button
            onClick={() => setActiveTab("guess")}
            className={`px-6 py-2 rounded-sm font-body text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
              activeTab === "guess" ? "bg-ember/20 text-gold border border-gold/30 shadow-inner" : "text-parchment/60 hover:text-parchment"
            }`}
          >
            Where Were We?
          </button>
          <button
            onClick={() => setActiveTab("memory")}
            className={`px-6 py-2 rounded-sm font-body text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
              activeTab === "memory" ? "bg-ember/20 text-gold border border-gold/30 shadow-inner" : "text-parchment/60 hover:text-parchment"
            }`}
          >
            Memory Match
          </button>
        </div>
      </div>

      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === "guess" ? (
            <motion.div
              key="guess"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <GuessGame />
            </motion.div>
          ) : (
            <motion.div
              key="memory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <MemoryMatch />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ChapterFrame>
  );
}
