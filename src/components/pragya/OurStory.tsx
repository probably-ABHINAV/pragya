import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { timeline } from "@/data/pragya";
import { ChapterHeader } from "./ChapterFrame";
import { Ornament } from "./Ornament";
import { HiddenHeart } from "./HiddenHeart";

function StorySlide({ e, i }: { e: typeof timeline[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden snap-start py-20 px-4"
    >
      {/* Blurred background layer */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <img src={e.photo_url} alt="" className="w-full h-full object-cover object-center blur-xl opacity-30" loading="lazy" />
      </motion.div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, oklch(0.15 0.05 30 / 0.8), oklch(0.12 0.05 30 / 0.95))" }}
      />
      <div className="absolute inset-0 pointer-events-none grain" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center gap-8 sm:gap-12"
      >
        <p className="eyebrow">Phase {String(i + 1)}</p>
        
        {/* Full Photo in Polaroid Frame */}
        <div className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-3xl relative rounded-sm shadow-2xl bg-parchment p-3 sm:p-4 rotate-[-1deg] hover:rotate-1 transition-transform duration-700 mx-auto">
            <div className="relative w-full bg-black/5 shadow-inner flex items-center justify-center overflow-hidden rounded-[2px]">
               <img 
                 src={e.photo_url} 
                 alt="" 
                 className="w-full h-auto max-h-[70vh] object-contain" 
                 loading="lazy" 
               />
            </div>
        </div>

        {/* Caption */}
        <div className="max-w-xl px-4">
           <p className="font-display italic text-parchment text-2xl sm:text-3xl md:text-4xl leading-relaxed whitespace-pre-line drop-shadow-lg">
             "{e.caption}"
           </p>
        </div>
      </motion.div>
    </section>
  );
}

export function OurStory() {
  return (
    <div id="story" data-chapter={3} className="relative">
      <div className="px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto flex justify-end mb-4">
          <HiddenHeart id={3} message="If you're smiling right now, mission successful." />
        </div>
        <ChapterHeader index={3} title="Our story, in pieces" subtitle="Turn slowly — every one is a small doorway." />
      </div>
      <div className="snap-y snap-mandatory">
        {timeline.map((e, i) => (
          <StorySlide key={e.id} e={e} i={i} />
        ))}
      </div>
    </div>
  );
}
