import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { memories } from "@/data/pragya";

const EMBER = ["#e8b84a", "#d4842a", "#9b4423", "#f4e4c1"];

type Card = {
  id: string;
  photo_url: string;
  isFlipped: boolean;
  isMatched: boolean;
};

function shuffle<T>(a: T[]): T[] {
  return [...a].sort(() => Math.random() - 0.5);
}

export function MemoryMatch() {
  // Use first 6 photos to create 12 cards (6 pairs)
  const initialCards = useMemo(() => {
    const selectedPhotos = memories.slice(0, 6).map((m) => m.photo_url);
    const pairs = [...selectedPhotos, ...selectedPhotos];
    return shuffle(pairs).map((photo_url, index) => ({
      id: `${index}`,
      photo_url,
      isFlipped: false,
      isMatched: false,
    }));
  }, []);

  const [cards, setCards] = useState<Card[]>(initialCards);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsLocked(true);
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex].photo_url === cards[secondIndex].photo_url) {
        setCards((prev) => {
          const newCards = [...prev];
          newCards[firstIndex].isMatched = true;
          newCards[secondIndex].isMatched = true;
          return newCards;
        });
        setFlippedIndices([]);
        setIsLocked(false);
      } else {
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
    const selectedPhotos = memories.slice(0, 6).map((m) => m.photo_url);
    const pairs = [...selectedPhotos, ...selectedPhotos];
    setCards(
      shuffle(pairs).map((photo_url, index) => ({
        id: `${index}`,
        photo_url,
        isFlipped: false,
        isMatched: false,
      }))
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <div className="text-center mb-10">
        <p className="font-display italic text-2xl text-parchment/80">Memory Match</p>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-gold/60 mt-2">Find the matching pairs</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 [perspective:1000px]">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            className="relative aspect-square cursor-pointer transition-transform duration-500 [transform-style:preserve-3d]"
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
              <img src={card.photo_url} alt="Memory" className="w-full h-full object-cover object-[center_20%] grayscale-[0.2]" />
              {card.isMatched && (
                <div className="absolute inset-0 bg-parchment/20 mix-blend-overlay" />
              )}
            </div>
          </div>
        ))}
      </div>

      {hasWon && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
        >
          <div
            className="inline-block max-w-lg px-8 py-6 bg-parchment text-[oklch(0.32_0.10_30)] shadow-2xl relative"
            style={{ clipPath: "polygon(3% 8%, 97% 2%, 100% 92%, 4% 98%)" }}
          >
            <p className="font-display italic text-xl sm:text-2xl leading-snug">
              Every memory with you is a match made in heaven.
            </p>
          </div>
          <div className="mt-8">
            <button
              onClick={resetGame}
              className="ember-outline rounded-sm px-6 py-2 text-[10px] uppercase tracking-[0.35em] font-body"
            >
              Play Again
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
