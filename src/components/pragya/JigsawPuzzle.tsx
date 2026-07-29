import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HiddenHeart } from "./HiddenHeart";

// 3x3 puzzle means 9 positions. Position 8 is the empty slot.
const SIZE = 3;
const TILE_COUNT = SIZE * SIZE;
const EMPTY_INDEX = TILE_COUNT - 1;

// The chosen image for the puzzle
const IMAGE_URL = "/photos/photo_18.jpg"; // "Birthday Girl ❤️"

export function JigsawPuzzle() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    // Generate a solvable puzzle
    let initialTiles = Array.from({ length: TILE_COUNT }, (_, i) => i);
    // Simple shuffle (doing random valid moves from solved state to guarantee solvability)
    let emptyPos = EMPTY_INDEX;
    for (let i = 0; i < 100; i++) {
      const row = Math.floor(emptyPos / SIZE);
      const col = emptyPos % SIZE;
      const neighbors = [];
      if (row > 0) neighbors.push(emptyPos - SIZE);
      if (row < SIZE - 1) neighbors.push(emptyPos + SIZE);
      if (col > 0) neighbors.push(emptyPos - 1);
      if (col < SIZE - 1) neighbors.push(emptyPos + 1);
      
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      // Swap
      [initialTiles[emptyPos], initialTiles[randomNeighbor]] = [initialTiles[randomNeighbor], initialTiles[emptyPos]];
      emptyPos = randomNeighbor;
    }
    setTiles(initialTiles);
  }, []);

  useEffect(() => {
    if (tiles.length === 0) return;
    const solved = tiles.every((val, index) => val === index);
    if (solved) setIsSolved(true);
  }, [tiles]);

  const handleTileClick = (index: number) => {
    if (isSolved) return;
    const emptyIndex = tiles.indexOf(EMPTY_INDEX);
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const emptyRow = Math.floor(emptyIndex / SIZE);
    const emptyCol = emptyIndex % SIZE;

    // Check if adjacent
    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;
    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 px-4 relative flex flex-col items-center">
      <div className="absolute top-0 right-4 z-10">
        <HiddenHeart id={9} message="Putting the pieces together." />
      </div>

      <div className="text-center mb-8">
        <p className="font-display italic text-3xl text-parchment/80">The Big Picture</p>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-gold/60 mt-2">Slide the tiles to complete the photo</p>
      </div>

      <div className="relative w-full max-w-[300px] sm:max-w-[400px] aspect-square bg-parchment/5 border-2 border-gold/40 rounded-sm p-1">
        <div className="absolute inset-1 grid grid-cols-3 grid-rows-3 gap-1">
          {tiles.map((tileVal, index) => {
            const isEmpty = tileVal === EMPTY_INDEX && !isSolved;
            
            // Calculate background position based on the original tile value
            const bgRow = Math.floor(tileVal / SIZE);
            const bgCol = tileVal % SIZE;
            
            return (
              <motion.button
                key={tileVal}
                layout
                onClick={() => handleTileClick(index)}
                className={`relative w-full h-full overflow-hidden rounded-sm transition-opacity ${isEmpty ? "opacity-0 cursor-default" : "cursor-pointer"}`}
                style={{
                  backgroundImage: `url(${IMAGE_URL})`,
                  backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`,
                  backgroundPosition: `${(bgCol / (SIZE - 1)) * 100}% ${(bgRow / (SIZE - 1)) * 100}%`,
                }}
              >
                {!isSolved && !isEmpty && (
                  <div className="absolute inset-0 border border-parchment/20 mix-blend-overlay hover:bg-parchment/10 transition-colors" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isSolved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <div className="inline-block px-8 py-6 bg-parchment text-[oklch(0.32_0.10_30)] shadow-xl rounded-sm">
              <p className="font-display italic text-2xl leading-relaxed">
                Every piece led back to you.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
