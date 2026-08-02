import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
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

type PopupData = {
  photo_url: string;
  message: string;
};

function shuffle<T>(a: T[]): T[] {
  return [...a].sort(() => Math.random() - 0.5);
}

export function MemoryMatch() {
  const initialCards = useMemo(() => {
    const cards: Card[] = [];
    memoryMatchPairs.forEach((pair, idx) => {
      cards.push({ id: `c1_${idx}`, pairId: pair.id, photo_url: pair.photo_url, isFlipped: false, isMatched: false });
      cards.push({ id: `c2_${idx}`, pairId: pair.id, photo_url: pair.photo_url, isFlipped: false, isMatched: false });
    });
    return shuffle(cards);
  }, []);

  const [cards, setCards] = useState<Card[]>(initialCards);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  
  // The active popup data when a match is found
  const [popupData, setPopupData] = useState<PopupData | null>(null);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (!firstCard || !secondCard || firstCard.isMatched || secondCard.isMatched) return;

      setIsLocked(true);

      if (firstCard.pairId === secondCard.pairId) {
        // Matched
        const pairData = memoryMatchPairs.find((p) => p.id === firstCard.pairId);

        setCards((prev) => {
          const newCards = [...prev];
          newCards[firstIndex].isMatched = true;
          newCards[secondIndex].isMatched = true;
          return newCards;
        });
        
        if (pairData) {
          // Show popup immediately to prevent perceived lag
          setTimeout(() => {
            setPopupData({ photo_url: pairData.photo_url, message: pairData.message });
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: EMBER,
              zIndex: 200,
            });
          }, 100);
        } else {
          setFlippedIndices([]);
          setIsLocked(false);
        }
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
    if (cards.length > 0 && cards.every((card) => card.isMatched) && !popupData) {
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
  }, [cards, hasWon, popupData]);

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    setCards((prev) => {
      const newCards = [...prev];
      newCards[index].isFlipped = true;
      return newCards;
    });
    setFlippedIndices((prev) => [...prev, index]);
  };

  const closePopup = () => {
    setPopupData(null);
    setFlippedIndices([]);
    setIsLocked(false);
  };

  const resetGame = () => {
    setHasWon(false);
    setFlippedIndices([]);
    setPopupData(null);
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

      {/* MATCH POPUP OVERLAY */}
      <AnimatePresence>
        {popupData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={closePopup}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-md w-full bg-parchment p-4 pb-10 rounded-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closePopup}
                className="absolute -top-10 right-0 sm:-right-10 sm:top-0 text-parchment hover:text-white w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                aria-label="Close popup"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-full aspect-[4/3] rounded-sm overflow-hidden border border-black/10 shadow-inner bg-black/5">
                <img 
                  src={popupData.photo_url} 
                  alt="Matched memory" 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div className="mt-6 text-center px-4">
                <p className="font-display italic text-2xl text-gold mb-2">It's a Match!</p>
                <p className="font-hand text-xl text-[oklch(0.35_0.10_30)] drop-shadow-sm leading-snug">
                  {popupData.message}
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={closePopup}
                  className="px-6 py-2 bg-[oklch(0.35_0.10_30)] text-parchment rounded-full text-sm font-body tracking-wider hover:bg-[oklch(0.25_0.10_30)] transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
