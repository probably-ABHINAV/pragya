import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause } from "lucide-react";
import { allPhotos } from "@/data/pragya";
import { ChapterFrame } from "./ChapterFrame";

export function MovieReel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allPhotos.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <ChapterFrame id="film" index={5} title="A Film of Us" subtitle="Every moment we didn't want to forget." fullBleed={true}>
      <div className="relative w-full h-[100svh] bg-black overflow-hidden group">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ opacity: { duration: 1.5 }, scale: { duration: 6, ease: "linear" } }}
            className="absolute inset-0"
          >
            <img
              src={allPhotos[currentIndex]}
              alt="Memory film"
              className="w-full h-full object-cover object-[center_30%]"
            />
            {/* Cinematic overlay vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end items-center pb-24 sm:pb-32 z-10 pointer-events-none text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="eyebrow text-parchment/70 mb-4 drop-shadow-md">Chapter V</p>
            <h2 className="font-display italic text-parchment text-4xl sm:text-6xl drop-shadow-lg">
              A Film of Us
            </h2>
          </motion.div>
        </div>

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
