import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { timeline } from "@/data/pragya";
import { ChapterHeader } from "./ChapterFrame";
import { Ornament } from "./Ornament";

function StorySlide({ e, i }: { e: typeof timeline[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden snap-start"
    >
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <img src={e.photo_url} alt="" className="w-full h-full object-cover object-[center_30%]" loading="lazy" />
      </motion.div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, oklch(0.22 0.06 30 / 0.65), oklch(0.22 0.06 30 / 0.85))" }}
      />
      <div className="absolute inset-0 pointer-events-none grain" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 max-w-2xl text-center px-6"
      >
        <p className="eyebrow mb-6">Moment {String(i + 1).padStart(2, "0")}</p>
        <p className="font-display italic text-parchment text-3xl sm:text-5xl md:text-6xl leading-tight mb-8">
          "{e.caption}"
        </p>
        <div className="flex justify-center"><Ornament className="w-40 text-gold/60" /></div>
        <p className="mt-6 text-gold/80 font-body text-[11px] tracking-[0.35em] uppercase">{e.date}</p>
      </motion.div>
    </section>
  );
}

export function OurStory() {
  return (
    <div id="story" data-chapter={3} className="relative">
      <div className="px-6 py-24 md:py-32">
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
