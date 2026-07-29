import { useState } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEasterEggs } from "@/hooks/useEasterEggs";

export function HiddenHeart({ id, message, className }: { id: number; message: string; className?: string }) {
  const { foundHearts, discoverHeart } = useEasterEggs();
  const [showTooltip, setShowTooltip] = useState(false);
  const isFound = foundHearts.includes(id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFound) {
      discoverHeart(id);
    }
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 3000);
  };

  return (
    <div className={`relative inline-block ${className || ""}`}>
      <button
        onClick={handleClick}
        className={`transition-colors duration-500 ease-in-out hover:scale-110 ${
          isFound ? "text-ember" : "text-transparent hover:text-ember/30"
        }`}
        aria-label="A hidden heart"
      >
        <Heart className="w-4 h-4 fill-current" />
      </button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-ember text-parchment text-xs px-3 py-1.5 rounded shadow-lg z-50 text-center pointer-events-none"
          >
            {message}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ember" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
