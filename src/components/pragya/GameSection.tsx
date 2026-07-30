import { useState } from "react";
import { ChapterFrame } from "./ChapterFrame";
import { motion, AnimatePresence } from "motion/react";
import { MemoryMatch } from "./MemoryMatch";
import { TimelinePuzzle } from "./TimelinePuzzle";
import { JigsawPuzzle } from "./JigsawPuzzle";

type Question = {
  q: string;
  options: string[];
  correctMsg: string;
  correctIdx?: number;
  checkAnswer?: (idx: number) => string;
};

const triviaData = {
  questions: [
    {
      q: "Who is the third wheel in our relationship?",
      options: ["Nobody", "Virat Kohli", "School", "Mobile Network"],
      correctIdx: 1,
      correctMsg: "Dear Virat, thank you for your cooperation. 😂",
    },
    {
      q: "What is stronger?",
      options: ["Distance", "Misunderstandings", "Time", "Us"],
      correctIdx: 3,
      correctMsg: "Us. Always. ❤️",
    },
    {
      q: "When Pragya sends 'Okay.' it usually means:",
      options: ["Okay", "Okay", "Definitely okay", "Investigate further"],
      correctIdx: 3,
      correctMsg: "Historical evidence suggests: Investigate further. 😂",
    },
    {
      q: "Strangers → Friends → Enemies → Friends Again → Best Friends → ?",
      options: ["Strangers Again", "More fights", "Love", "Nothing"],
      correctIdx: 2,
      correctMsg: "And if I had to start over, I'd still choose the same ending. ❤️",
    },
    {
      q: "If Virat Kohli and Karunya called at the same time, who gets picked first?",
      options: ["Virat", "Karunya", "Conference Call", "Depends on Virat's batting form"],
      correctIdx: 3,
      correctMsg: "Honestly... fair enough. 😂",
    },
  ] as Question[]
};

function TriviaGame() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const q = triviaData.questions[currentQ];
    
    if (q.checkAnswer) {
      setFeedback(q.checkAnswer(idx));
    } else {
      if (idx === q.correctIdx) {
        setFeedback(q.correctMsg);
      } else {
        setFeedback("Try again.");
      }
    }
  };

  const nextQ = () => {
    setSelected(null);
    setFeedback(null);
    setCurrentQ(prev => (prev + 1) % triviaData.questions.length);
  };

  const q = triviaData.questions[currentQ];

  return (
    <div className="max-w-xl mx-auto p-6 bg-parchment/10 border border-gold/20 shadow-lg relative min-h-[300px] mt-12">
      <div className="text-center mb-8">
        <p className="font-display italic text-3xl text-parchment/80">Question Game</p>
        <p className="eyebrow text-gold/60 mt-2">Question {currentQ + 1} of {triviaData.questions.length}</p>
      </div>

      <h3 className="font-display italic text-2xl sm:text-3xl text-parchment text-center mb-8 drop-shadow-md">
        {q.q}
      </h3>
      
      <div className="grid gap-3">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`w-full text-left px-4 py-3 border transition-colors ${
              selected === idx 
                ? "bg-gold/20 border-gold text-parchment"
                : selected !== null
                ? "border-gold/10 text-parchment/40 cursor-not-allowed"
                : "border-gold/20 hover:border-gold/60 text-parchment/80 hover:bg-gold/5"
            }`}
          >
            <span className="inline-block w-6 text-gold/60 font-body text-xs">{String.fromCharCode(65 + idx)}.</span>
            {opt}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 text-center"
          >
            <p className="font-display italic text-xl text-ember drop-shadow-sm mb-4">
              {feedback}
            </p>
            <button
              onClick={nextQ}
              className="px-6 py-2 bg-ember/20 text-parchment border border-ember/30 hover:bg-ember/30 transition-colors uppercase tracking-[0.2em] text-xs font-body"
            >
              Next
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const tabs = {
  memory: {
    title: "Memory Match",
    component: MemoryMatch,
  },
  timeline: {
    title: "Timeline Puzzle",
    component: TimelinePuzzle,
  },
  jigsaw: {
    title: "Jigsaw Puzzle",
    component: JigsawPuzzle,
  },
  trivia: {
    title: "Question Game",
    component: TriviaGame,
  }
};

export function GameSection() {
  const [activeTab, setActiveTab] = useState<keyof typeof tabs>("memory");

  return (
    <ChapterFrame id="game" index={7} title="Interactive Memories" subtitle="Some things are better felt than read.">
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2 mb-12">
        {(Object.keys(tabs) as Array<keyof typeof tabs>).map((k) => (
          <button
            key={k}
            onClick={() => setActiveTab(k)}
            className={`px-4 sm:px-6 py-2 rounded-sm font-body text-[10px] sm:text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${
              activeTab === k ? "bg-ember/20 text-gold border border-gold/30 shadow-inner" : "text-parchment/60 hover:text-parchment border border-transparent"
            }`}
          >
            {tabs[k].title}
          </button>
        ))}
      </div>

      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {(() => {
              const Component = tabs[activeTab].component;
              return <Component />;
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
    </ChapterFrame>
  );
}
