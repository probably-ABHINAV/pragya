import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import confetti from "canvas-confetti";
import type { Letter } from "@/data/pragya";
import { WaxSeal } from "./WaxSeal";
import { Ornament } from "./Ornament";

const WAX_COLORS = ["#8a2a1a", "#5c2018", "#d4842a", "#e8b84a", "#f4e4c1"];

/** Tiny WebAudio "wax crack + parchment unfold" — no audio assets required. */
function playOpenSound() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;

    // 1. Wax crack — short filtered noise burst
    const bufSize = ctx.sampleRate * 0.35;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      // decaying noise with an initial snap
      const t = i / bufSize;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3) * (i < 400 ? 1 : 0.4);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1800;
    bp.Q.value = 0.9;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.35, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    noise.connect(bp).connect(ng).connect(ctx.destination);
    noise.start(now);

    // 2. Warm low thud under it — the seal breaking
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.25);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.25, now);
    og.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(og).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);

    // 3. Parchment unfold — soft high-frequency rustle, delayed
    const rBuf = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
    const rData = rBuf.getChannelData(0);
    for (let i = 0; i < rData.length; i++) {
      const t = i / rData.length;
      rData[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * 0.6;
    }
    const rustle = ctx.createBufferSource();
    rustle.buffer = rBuf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 4000;
    const rg = ctx.createGain();
    rg.gain.setValueAtTime(0.001, now + 0.55);
    rg.gain.linearRampToValueAtTime(0.12, now + 0.7);
    rg.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
    rustle.connect(hp).connect(rg).connect(ctx.destination);
    rustle.start(now + 0.55);

    setTimeout(() => ctx.close().catch(() => {}), 1600);
  } catch { /* silently ignore if AudioContext refused */ }
}

/** Shower of tiny wax + gold shards from the seal position. */
function waxBurst(x: number, y: number) {
  const opts = {
    origin: { x, y },
    colors: WAX_COLORS,
    ticks: 180,
    scalar: 0.9,
    startVelocity: 28,
  };
  confetti({ ...opts, particleCount: 40, spread: 360, shapes: ["circle"] as const });
  setTimeout(() => confetti({ ...opts, particleCount: 24, spread: 90, gravity: 1.2, shapes: ["square"] as const, scalar: 0.7 }), 120);
}

type Stage = "sealed" | "cracking" | "unfolding" | "open";

export function LetterOpen({
  letter,
  onClose,
  closeRef,
}: {
  letter: Letter;
  onClose: () => void;
  closeRef: any;
}) {
  const [stage, setStage] = useState<Stage>("sealed");
  const [showContinue, setShowContinue] = useState(false);
  const article = useRef<HTMLElement>(null);
  const sealAnchor = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;

  // Timed opening sequence
  useEffect(() => {
    if (reduce) {
      setStage("open");
      setShowContinue(true);
      return;
    }
    const timers: number[] = [];
    // start cracking after a beat
    timers.push(window.setTimeout(() => {
      setStage("cracking");
      const r = sealAnchor.current?.getBoundingClientRect();
      const x = r ? (r.left + r.width / 2) / window.innerWidth : 0.5;
      const y = r ? (r.top + r.height / 2) / window.innerHeight : 0.5;
      waxBurst(x, y);
      playOpenSound();
    }, 350));
    timers.push(window.setTimeout(() => setStage("unfolding"), 1050));
    timers.push(window.setTimeout(() => setStage("open"), 1850));
    // "continue" cue after ~5s of reading
    timers.push(window.setTimeout(() => setShowContinue(true), 5200));
    return () => timers.forEach(window.clearTimeout);
  }, [reduce]);

  // Reveal continue cue early if the reader scrolls to the bottom
  useEffect(() => {
    const el = article.current;
    if (!el || showContinue) return;
    const onScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setShowContinue(true);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [showContinue]);

  // Focus close button once the letter is fully open
  useEffect(() => {
    if (stage === "open") setTimeout(() => closeRef.current?.focus(), 100);
  }, [stage, closeRef]);

  const cracked = stage !== "sealed";
  const unfolded = stage === "unfolding" || stage === "open";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "oklch(0.08 0.03 30 / 0.96)", backdropFilter: "blur(24px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="letter-title"
    >
      <div
        className="relative w-full max-w-lg"
        style={{ perspective: 1400 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Envelope shell that fades out once the letter has unfolded */}
        <motion.div
          aria-hidden
          initial={{ opacity: 1, scale: 0.9, y: 20 }}
          animate={{ opacity: unfolded ? 0 : 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute inset-0 rounded-sm overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)]"
            style={{
              background: "linear-gradient(140deg, oklch(0.42 0.13 45), oklch(0.28 0.10 30))",
              aspectRatio: "3 / 2",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {/* Back flap that peels open */}
            <motion.svg
              viewBox="0 0 200 130"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full origin-top"
              initial={{ rotateX: 0 }}
              animate={{ rotateX: cracked ? -175 : 0 }}
              transition={{ duration: 0.7, ease: [0.6, 0, 0.4, 1], delay: cracked ? 0.1 : 0 }}
              style={{ transformStyle: "preserve-3d" }}
              aria-hidden
            >
              <polygon points="0,0 100,70 200,0" fill="oklch(0.36 0.12 40)" />
              <line x1="0" y1="0" x2="100" y2="70" stroke="oklch(0.85 0.14 70 / 0.35)" strokeWidth="0.5" />
              <line x1="200" y1="0" x2="100" y2="70" stroke="oklch(0.85 0.14 70 / 0.35)" strokeWidth="0.5" />
            </motion.svg>

            {/* Wax seal — cracks into two halves that spin off */}
            <div ref={sealAnchor} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                className="relative"
                initial={{ scale: 1 }}
                animate={cracked ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.15 }}
              >
                {/* Left half */}
                <motion.div
                  initial={{ x: 0, rotate: 0, opacity: 1 }}
                  animate={cracked ? { x: -140, y: 40, rotate: -60, opacity: 0 } : {}}
                  transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                  style={{ clipPath: "polygon(0 0, 52% 0, 46% 100%, 0 100%)" }}
                  className="absolute inset-0"
                >
                  <WaxSeal initial="P" size={72} />
                </motion.div>
                {/* Right half */}
                <motion.div
                  initial={{ x: 0, rotate: 0, opacity: 1 }}
                  animate={cracked ? { x: 140, y: 40, rotate: 60, opacity: 0 } : {}}
                  transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                  style={{ clipPath: "polygon(52% 0, 100% 0, 100% 100%, 46% 100%)" }}
                  className="absolute inset-0"
                >
                  <WaxSeal initial="P" size={72} />
                </motion.div>
                {/* Placeholder so parent has size */}
                <div className="opacity-0 pointer-events-none"><WaxSeal initial="P" size={72} /></div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Parchment slides up out of the envelope and unfolds */}
        <motion.article
          ref={article}
          initial={{ y: 40, scaleY: 0.35, opacity: 0 }}
          animate={unfolded ? { y: 0, scaleY: 1, opacity: 1 } : { y: 40, scaleY: 0.35, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            transformOrigin: "top center",
            background: "linear-gradient(180deg, oklch(0.94 0.04 75), oklch(0.90 0.05 70))",
            color: "oklch(0.28 0.08 30)",
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 30px, oklch(0.75 0.06 60 / 0.22) 30px, oklch(0.75 0.06 60 / 0.22) 31px),
              radial-gradient(ellipse at top left, oklch(0.98 0.03 75), transparent 60%)
            `,
            clipPath: "polygon(2% 0%, 98% 1%, 100% 3%, 99% 97%, 97% 100%, 3% 99%, 1% 97%, 0% 3%)",
            maxHeight: "82vh",
            overflowY: "auto",
          }}
          className="relative p-8 sm:p-12 shadow-2xl"
        >
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close letter"
            className="absolute top-3 right-3 text-[oklch(0.4_0.08_30)] hover:text-[oklch(0.2_0.06_30)] w-9 h-9 grid place-items-center rounded-sm z-10"
          >
            <X className="w-4 h-4" aria-hidden />
          </button>

          <motion.p
            id="letter-title"
            initial={{ opacity: 0, y: 8 }}
            animate={unfolded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-[10px] uppercase tracking-[0.35em] text-[oklch(0.48_0.12_40)] mb-6 text-center"
          >
            {letter.title}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={unfolded ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.9 }}
            className="font-display italic text-xl sm:text-2xl leading-[1.55] whitespace-pre-line drop-cap"
          >
            {letter.body}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={unfolded ? { opacity: 1 } : {}}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-6 text-right font-hand text-2xl text-[oklch(0.42_0.14_40)]"
          >
            — P.
          </motion.div>

          {/* Continue cue — fades in once the letter has been read */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={showContinue ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <Ornament className="w-24 text-[oklch(0.55_0.14_45)]/60" />
            <button
              onClick={onClose}
              className="text-[10px] uppercase tracking-[0.4em] text-[oklch(0.42_0.14_40)] hover:text-[oklch(0.28_0.10_30)] transition-colors font-body group"
            >
              <span className="relative">
                fold it back
                <motion.span
                  aria-hidden
                  className="inline-block ml-2"
                  animate={showContinue ? { x: [0, 4, 0] } : {}}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  ↩
                </motion.span>
              </span>
            </button>
          </motion.div>
        </motion.article>
      </div>
    </motion.div>
  );
}
