import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, X } from "lucide-react";
import { useAudio } from "@/hooks/useAudioPlayer";
import { Visualizer } from "./Visualizer";

function fmt(s: number) {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function MiniPlayer() {
  const audio = useAudio();
  const pct = audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0;

  return (
    <AnimatePresence>
      {audio.current && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-xl"
          role="region"
          aria-label="Now playing"
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-gold/30 px-3 py-3 sm:px-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.30 0.10 35 / 0.92), oklch(0.22 0.08 30 / 0.94))",
              backdropFilter: "blur(28px) saturate(150%)",
              boxShadow:
                "0 30px 80px -30px oklch(0.7 0.16 55 / 0.5), inset 0 1px 0 oklch(0.85 0.14 70 / 0.18)",
            }}
          >
            {/* top row: art / title / controls */}
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3">
              <div className="relative shrink-0">
                {audio.current.cover_url ? (
                  <img
                    src={audio.current.cover_url}
                    alt=""
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-ember/25 grid place-items-center text-ember">♥</div>
                )}
                {audio.playing && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full border border-gold/50"
                    style={{ animation: "vinyl-spin 8s linear infinite" }}
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-parchment font-display italic text-base sm:text-lg truncate leading-tight">
                  {audio.current.title}
                </p>
                {audio.current.artist && (
                  <p className="text-muted-foreground text-[10px] sm:text-[11px] truncate font-body uppercase tracking-[0.25em]">
                    {audio.current.artist}
                  </p>
                )}
              </div>
              <button
                onClick={audio.toggle}
                className="w-10 h-10 rounded-full ember-outline grid place-items-center shrink-0"
                aria-label={audio.playing ? "Pause" : "Play"}
              >
                {audio.playing ? <Pause className="w-4 h-4" aria-hidden /> : <Play className="w-4 h-4 translate-x-[1px]" aria-hidden />}
              </button>
              <button
                onClick={audio.stop}
                className="w-10 h-10 rounded-full grid place-items-center text-parchment/50 hover:text-parchment shrink-0"
                aria-label="Close player"
              >
                <X className="w-4 h-4" aria-hidden />
              </button>
            </div>

            {/* visualizer */}
            <div className="mt-2 h-7 px-1">
              <Visualizer height={28} bars={32} />
            </div>

            {/* scrubber */}
            <div className="mt-1 flex items-center gap-3 px-1">
              <span className="text-[10px] font-body tabular-nums text-parchment/60 w-8 text-right">
                {fmt(audio.currentTime)}
              </span>
              <div className="relative flex-1 h-4 flex items-center group">
                {/* track */}
                <div className="absolute inset-x-0 h-[3px] rounded-full bg-parchment/15" aria-hidden />
                {/* fill */}
                <div
                  className="absolute h-[3px] rounded-full bg-gradient-to-r from-ember to-gold pointer-events-none"
                  style={{ width: `${pct}%` }}
                  aria-hidden
                />
                {/* thumb */}
                <div
                  className="absolute w-3 h-3 rounded-full bg-gold shadow-[0_0_12px_rgba(232,184,74,0.7)] -translate-x-1/2 transition-transform group-hover:scale-125 pointer-events-none"
                  style={{ left: `${pct}%` }}
                  aria-hidden
                />
                <input
                  type="range"
                  min={0}
                  max={audio.duration || 0}
                  step={0.01}
                  value={audio.currentTime}
                  onChange={(e) => audio.seek(parseFloat(e.target.value))}
                  aria-label="Seek"
                  disabled={!audio.duration}
                  className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
              <span className="text-[10px] font-body tabular-nums text-parchment/60 w-8">
                {fmt(audio.duration)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
