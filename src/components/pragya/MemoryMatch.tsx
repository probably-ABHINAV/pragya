import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { memoryMatchPairs } from "@/data/pragya";
import { HiddenHeart } from "./HiddenHeart";

const EMBER = ["#e8b84a", "#d4842a", "#9b4423", "#f4e4c1"];

type Card = {
  id: string; // unique card id
  pairId: string; // the pair it belongs to
  photo_url: string;
  isFlipped: boolean;
  isMatched: boolean;
};

function shuffle<T>(a: T[]): T[] {
  return [...a].sort(() => Math.random() - 0.5);
}

export function MemoryMatch() {
  const initialCards = useMemo(() => {
    const cards: Card[] = [];
    memoryMatchPairs.forEach((pair, idx) => {
      cards.push({
        id: `c1_${idx}`,
        pairId: pair.id,
        photo_url: pair.photo_url,
        isFlipped: false,
        isMatched: false,
      });
      cards.push({
        id: `c2_${idx}`,
        pairId: pair.id,
        photo_url: pair.photo_url,
        isFlipped: false,
        isMatched: false,
      });
    });
    return shuffle(cards);
  }, []);

  const [cards, setCards] = useState<Card[]>(initialCards);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [matchMessage, setMatchMessage] = useState<string | null>(null);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsLocked(true);
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.pairId === secondCard.pairId) {
        // Matched
        const pairData = memoryMatchPairs.find((p) => p.id === firstCard.pairId);
        if (pairData) {
          setMatchMessage(pairData.message);
        }

        setCards((prev) => {
          const newCards = [...prev];
          newCards[firstIndex].isMatched = true;
          newCards[secondIndex].isMatched = true;
          return newCards;
        });
        
        // Hide message after 3 seconds
        setTimeout(() => {
          setMatchMessage(null);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 3000);
      } else {
        // Not matched
        setTimeout(() => {
          setCards((prev) => {
            const newCards = [...prev];
            newCards[firstIndex].isFlipped = false;
            newCards[secondIndex].isFlipped = false;
            return newCards;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  }, [flippedIndices, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      if (!hasWon) {
        setHasWon(true);
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.6 },
          colors: EMBER,
          shapes: ["circle", "square"],
          scalar: 1.2,
        });
      }
    }
  }, [cards, hasWon]);

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    setCards((prev) => {
      const newCards = [...prev];
      newCards[index].isFlipped = true;
      return newCards;
    });
    setFlippedIndices((prev) => [...prev, index]);
  };

  const resetGame = () => {
    setHasWon(false);
    setFlippedIndices([]);
    setMatchMessage(null);
    const newCards: Card[] = [];
    memoryMatchPairs.forEach((pair, idx) => {
      newCards.push({ id: `c1_${idx}`, pairId: pair.id, photo_url: pair.photo_url, isFlipped: false, isMatched: false });
      newCards.push({ id: `c2_${idx}`, pairId: pair.id, photo_url: pair.photo_url, isFlipped: false, isMatched: false });
    });
    setCards(shuffle(newCards));
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4 relative">
      <div className="absolute top-0 right-4 z-10">
        <HiddenHeart id={10} message="Two halves of the same whole." />
      </div>

      <div className="text-center mb-10">
        <p className="font-display italic text-2xl sm:text-3xl text-parchment/80">Memory Match</p>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-gold/60 mt-2">Find the meaningful pairs</p>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 [perspective:1000px] mb-8 relative">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            className="relative aspect-[3/4] sm:aspect-square cursor-pointer transition-transform duration-500 [transform-style:preserve-3d]"
            style={{
              transform: card.isFlipped || card.isMatched ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front of card (hidden side, shows pattern/logo) */}
            <div className="absolute inset-0 [backface-visibility:hidden] bg-parchment/10 border border-gold/30 rounded-sm shadow-sm flex items-center justify-center hover:bg-parchment/20 transition-colors">
              <span className="font-display italic text-3xl text-gold/40">?</span>
            </div>

            {/* Back of card (revealed side, shows photo) */}
            <div
              className="absolute inset-0 [backface-visibility:hidden] rounded-sm overflow-hidden border-2 border-gold/60"
              style={{ transform: "rotateY(180deg)" }}
            >
              <img src={card.photo_url} alt="Memory" className="w-full h-full object-cover object-center grayscale-[0.2]" />
              {card.isMatched && (
                <div className="absolute inset-0 bg-parchment/20 mix-blend-overlay" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="min-h-[80px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {matchMessage && !hasWon && (
            <motion.div
              key={matchMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center px-4"
            >
              <p className="font-display italic text-xl text-ember drop-shadow-sm">{matchMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {hasWon && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div
            className="inline-block max-w-lg px-8 py-6 bg-parchment text-[oklch(0.32_0.10_30)] shadow-2xl relative rounded-sm"
          >
            <p className="font-display italic text-xl sm:text-2xl leading-snug">
              Every memory with you is a perfect match.
            </p>
          </div>
          <div className="mt-8">
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-ember/20 text-parchment border border-ember/30 hover:bg-ember/30 transition-colors uppercase tracking-[0.2em] text-xs font-body"
            >
              Play Again
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
