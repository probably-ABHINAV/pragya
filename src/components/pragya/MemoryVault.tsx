import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { memories, type MemoryPhoto } from "@/data/pragya";
import { ChapterFrame, SectionReveal } from "./ChapterFrame";

export function MemoryVault() {
  const [open, setOpen] = useState<MemoryPhoto | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const openPhoto = (m: MemoryPhoto, e: React.MouseEvent) => {
    openerRef.current = e.currentTarget as HTMLElement;
    setOpen(m);
  };
  const close = () => {
    setOpen(null);
    setTimeout(() => openerRef.current?.focus(), 50);
  };
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    setTimeout(() => closeRef.current?.focus(), 100);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <ChapterFrame id="vault" index={5} title="A contact sheet of us" subtitle="Every photograph is a small proof.">

      <SectionReveal>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {memories.map((m, i) => (
            <motion.button
              key={m.id}
              onClick={(e) => openPhoto(m, e)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: (i % 4) * 0.05, ease: "easeOut" }}
              whileHover={{ y: -4, rotate: i % 2 === 0 ? -1 : 1 }}
              className="group block p-2 sm:p-3 pb-6 sm:pb-10 bg-parchment/95 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)] rounded-sm"
              style={{ transform: `rotate(${(i % 3 - 1) * 0.6}deg)` }}
              aria-label={`Open photo: ${m.caption}`}
            >
              <div className="aspect-square overflow-hidden">
                <img src={m.photo_url} alt={m.caption} loading="lazy" className="w-full h-full object-cover grayscale-[0.15] transition duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]" />
              </div>
              <p className="mt-2 sm:mt-3 font-hand text-[oklch(0.32_0.10_30)] text-sm sm:text-base text-center truncate px-1">
                {m.caption}
              </p>
            </motion.button>
          ))}
        </div>
      </SectionReveal>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={open.caption}
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center p-6"
            style={{ background: "oklch(0.12 0.03 30 / 0.94)", backdropFilter: "blur(24px)" }}
          >
            <button ref={closeRef} onClick={close} className="absolute top-6 right-6 text-parchment/70 hover:text-parchment w-10 h-10 grid place-items-center rounded-sm" aria-label="Close photo">
              <X aria-hidden />
            </button>
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5 }}
              src={open.photo_url} alt={open.caption}
              className="max-h-[75vh] max-w-full rounded-sm object-contain shadow-2xl"
            />
            <p className="font-display italic text-parchment text-2xl mt-6 text-center max-w-lg">{open.caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </ChapterFrame>
  );
}
