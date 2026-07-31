import { useEffect } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { Letter } from "@/data/pragya";

export function PhotoOverlay({
  letter,
  onClose,
  closeRef,
}: {
  letter: Letter;
  onClose: () => void;
  closeRef: any;
}) {
  useEffect(() => {
    setTimeout(() => closeRef.current?.focus(), 100);
  }, [closeRef]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "oklch(0.08 0.03 30 / 0.90)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-title"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-2xl w-full bg-parchment p-4 sm:p-6 pb-12 sm:pb-16 shadow-2xl rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close photo"
          className="absolute -top-12 right-0 sm:-right-12 sm:top-0 text-parchment hover:text-white w-10 h-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 transition-colors z-10"
        >
          <X className="w-5 h-5" aria-hidden />
        </button>

        {letter.image_url && (
          <div className="w-full relative rounded-sm overflow-hidden border border-black/5 shadow-inner bg-white">
            <img 
              src={letter.image_url} 
              alt={letter.title} 
              className="w-full h-auto max-h-[70vh] object-cover"
            />
          </div>
        )}

        <div className="absolute bottom-3 sm:bottom-4 inset-x-0 text-center px-6">
          <p
            id="photo-title"
            className="font-hand text-2xl sm:text-3xl text-[oklch(0.35_0.10_30)] drop-shadow-sm"
          >
            {letter.title}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
