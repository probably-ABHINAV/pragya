import { useState, useEffect } from "react";
import { Reorder, motion, AnimatePresence } from "motion/react";
import { GripVertical } from "lucide-react";
import { HiddenHeart } from "./HiddenHeart";

const correctOrder = [
  "Strangers",
  "Friends",
  "Enemies",
  "Friends Again",
  "Best Friends",
  "Love"
];

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let randomIndex;
  const newArray = [...array];
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
}

export function TimelinePuzzle() {
  const [items, setItems] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    // Initial shuffle avoiding the correct order
    let shuffled = shuffle(correctOrder);
    while (JSON.stringify(shuffled) === JSON.stringify(correctOrder)) {
      shuffled = shuffle(correctOrder);
    }
    setItems(shuffled);
  }, []);

  useEffect(() => {
    if (items.length > 0 && JSON.stringify(items) === JSON.stringify(correctOrder)) {
      setIsSolved(true);
    }
  }, [items]);

  return (
    <div className="max-w-xl mx-auto mt-12 px-4 relative">
      <div className="absolute top-0 right-4 z-10">
        <HiddenHeart id={8} message="Even out of order, it always led to you." />
      </div>

      <div className="text-center mb-10">
        <p className="font-display italic text-3xl text-parchment/80">Our Timeline</p>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-gold/60 mt-2 mb-6">Drag to sort our story</p>
      </div>

      <div className="relative">
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
          {items.map((item) => (
            <Reorder.Item
              key={item}
              value={item}
              dragListener={!isSolved}
              className={`flex items-center justify-between p-4 rounded-sm border transition-colors ${
                isSolved 
                  ? "bg-gold/10 border-gold/40 text-gold shadow-md" 
                  : "bg-parchment/5 border-gold/20 text-parchment/80 hover:bg-parchment/10 cursor-grab active:cursor-grabbing"
              }`}
            >
              <span className="font-display italic text-xl">{item}</span>
              {!isSolved && <GripVertical className="text-gold/40 w-5 h-5" />}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      <AnimatePresence>
        {isSolved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <div className="inline-block px-8 py-6 bg-parchment text-[oklch(0.32_0.10_30)] shadow-xl rounded-sm">
              <div className="font-display italic text-xl sm:text-2xl leading-relaxed text-center">
                {correctOrder.map((step, i) => (
                  <p key={step} className="mb-1">{step}.</p>
                ))}
                <p className="mt-4 font-bold text-ember">Still my favourite story.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
