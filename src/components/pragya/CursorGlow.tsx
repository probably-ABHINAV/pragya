import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const mx = useMotionValue(-500);
  const my = useMotionValue(-500);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  if (!enabled) return null;
  return (
    <motion.div
      className="pointer-events-none fixed z-30 w-[420px] h-[420px] rounded-full -translate-x-1/2 -translate-y-1/2"
      style={{
        left: sx,
        top: sy,
        background: "radial-gradient(circle, oklch(0.78 0.16 55 / 0.18), oklch(0.6 0.14 45 / 0.08) 40%, transparent 70%)",
        mixBlendMode: "screen",
      }}
      aria-hidden
    />
  );
}
