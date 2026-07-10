import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { Ornament } from "./Ornament";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function ChapterFrame({
  id,
  index,
  title,
  subtitle,
  children,
  className = "",
  fullBleed = false,
}: {
  id: string;
  index: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  fullBleed?: boolean;
}) {
  return (
    <section
      id={id}
      data-chapter={index}
      className={`relative min-h-[100svh] flex flex-col justify-center py-24 md:py-32 ${fullBleed ? "" : "px-6"} ${className}`}
    >
      {!fullBleed && (
        <ChapterHeader index={index} title={title} subtitle={subtitle} />
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export function ChapterHeader({ index, title, subtitle }: { index: number; title: string; subtitle?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center mb-16 md:mb-24 max-w-2xl mx-auto"
    >
      <p className="eyebrow mb-6">Chapter {ROMAN[index - 1] ?? index}</p>
      <h2 className="font-display italic text-parchment text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight">
        {title}
      </h2>
      <div className="my-8 flex justify-center">
        <Ornament className="w-40 text-gold/60" />
      </div>
      {subtitle && <p className="text-muted-foreground font-body text-sm sm:text-base italic max-w-md mx-auto">{subtitle}</p>}
    </motion.div>
  );
}

export function SectionReveal({ children, className, delay = 0, y = 30 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
