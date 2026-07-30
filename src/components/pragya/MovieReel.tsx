import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause } from "lucide-react";
import { allPhotos } from "@/data/pragya";
import { ChapterFrame } from "./ChapterFrame";
import { HiddenHeart } from "./HiddenHeart";

export function MovieReel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides = useMemo(() => {
    const textCards = [
      "School.",
      "Friendship.",
      "Chaos.",
      "Best Friends.",
      "Love.",
      "Still Choosing Each Other."
    ];
    
    const combined = [];
    const photosPerCard = Math.floor(allPhotos.length / (textCards.length + 1));
    
    let photoIdx = 0;
    for (let i = 0; i < textCards.length; i++) {
      for (let j = 0; j < photosPerCard; j++) {
        if (photoIdx < allPhotos.length) {
          combined.push({ type: "image", content: allPhotos[photoIdx++] });
        }
      }
      combined.push({ type: "text", content: textCards[i] });
    }
    while (photoIdx < allPhotos.length) {
      combined.push({ type: "image", content: allPhotos[photoIdx++] });
    }
    return combined;
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  return (
    <ChapterFrame id="film" index={5} title="A Film of Us" subtitle="Every moment we didn't want to forget." fullBleed={true}>
      <div className="absolute top-8 right-8 z-30">
        <HiddenHeart id={5} message="Virat, stop clicking my website." />
      </div>

      <div className="relative w-full h-[100svh] bg-black overflow-hidden group">
        <AnimatePresence initial={false} mode="wait">
          {slides[currentIndex].type === "image" ? (
            <motion.div
              key={`img-${currentIndex}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ opacity: { duration: 1.5 }, scale: { duration: 6, ease: "linear" } }}
              className="absolute inset-0"
            >
              <img
                src={slides[currentIndex].content}
                alt="Memory film"
                className="w-full h-full object-contain object-center"
              />
              {/* Cinematic overlay vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />
            </motion.div>
          ) : (
            <motion.div
              key={`txt-${currentIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 flex items-center justify-center bg-black"
            >
              <h2 className="font-display italic text-parchment text-5xl sm:text-7xl md:text-8xl drop-shadow-lg text-center px-6">
                {slides[currentIndex].content}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text Overlay for Image Slides */}
        <AnimatePresence>
          {slides[currentIndex].type === "image" && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex flex-col justify-end items-center pb-24 sm:pb-32 z-10 pointer-events-none text-center px-4"
            >
              <p className="eyebrow text-parchment/70 mb-4 drop-shadow-md">Chapter V</p>
              <h2 className="font-display italic text-parchment text-4xl sm:text-6xl drop-shadow-lg">
                A Film of Us
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute bottom-8 right-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-black/40 hover:bg-black/60 text-parchment p-3 rounded-full backdrop-blur-sm border border-parchment/20 transition-all"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
      </div>
    </ChapterFrame>
  );
}
