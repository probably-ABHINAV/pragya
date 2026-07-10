import { useEffect, useRef } from "react";
import { useAudio } from "@/hooks/useAudioPlayer";

/**
 * Canvas frequency-bar visualiser.
 * - Uses live AnalyserNode data when available (CORS-permitted audio).
 * - Falls back to a synthetic sine-driven waveform so the player always
 *   feels alive even for placeholder / cross-origin tracks.
 */
export function Visualizer({ height = 28, bars = 28 }: { height?: number; bars?: number }) {
  const { playing, getFrequencyData } = useAudio();
  const canvas = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number | null>(null);
  const t0 = useRef<number>(0);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const reduce = document.documentElement.hasAttribute("data-reduce-motion")
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (ts: number) => {
      if (!t0.current) t0.current = ts;
      const t = (ts - t0.current) / 1000;
      const w = c.width, h = c.height;
      ctx.clearRect(0, 0, w, h);

      const data = getFrequencyData();
      const gap = 2;
      const bw = Math.max(1, (w - gap * (bars - 1)) / bars);

      // amber gradient — matches Autumn Harvest palette
      const grad = ctx.createLinearGradient(0, h, 0, 0);
      grad.addColorStop(0, "rgba(212, 132, 42, 0.55)");
      grad.addColorStop(0.6, "rgba(232, 184, 74, 0.9)");
      grad.addColorStop(1, "rgba(244, 228, 193, 1)");
      ctx.fillStyle = grad;

      for (let i = 0; i < bars; i++) {
        let v: number;
        if (data && data.length) {
          // sample across the low/mid spectrum (skip DC + hiss)
          const idx = Math.floor(2 + (i / bars) * (data.length * 0.55));
          v = data[idx] / 255;
        } else if (playing && !reduce) {
          // synthetic: layered sines so it feels musical, not mechanical
          v = 0.35
            + 0.35 * Math.sin(t * 3 + i * 0.55)
            + 0.20 * Math.sin(t * 7.3 + i * 0.31)
            + 0.15 * Math.sin(t * 1.7 - i * 0.22);
          v = Math.max(0.08, Math.min(1, v));
        } else {
          v = 0.08;
        }
        const bh = Math.max(2, v * h);
        const x = i * (bw + gap);
        const y = h - bh;
        const r = Math.min(bw / 2, 2);
        // rounded top rectangle
        ctx.beginPath();
        ctx.moveTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.lineTo(x + bw - r, y);
        ctx.quadraticCurveTo(x + bw, y, x + bw, y + r);
        ctx.lineTo(x + bw, h);
        ctx.lineTo(x, h);
        ctx.closePath();
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
    };

    // Size canvas to CSS box × devicePixelRatio for crisp bars
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = c.getBoundingClientRect();
      c.width = Math.max(1, rect.width * dpr);
      c.height = Math.max(1, rect.height * dpr);
      ctx.scale(1, 1); // canvas coords already in pixel space
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    raf.current = requestAnimationFrame(draw);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, [playing, getFrequencyData, bars]);

  return (
    <canvas
      ref={canvas}
      style={{ width: "100%", height }}
      aria-hidden
    />
  );
}
