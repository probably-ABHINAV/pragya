import { Play, Pause, Check } from "lucide-react";
import { motion } from "motion/react";
import { songs } from "@/data/pragya";
import { useAudio } from "@/hooks/useAudioPlayer";
import { useProgress } from "@/hooks/useProgress";
import { ChapterFrame, SectionReveal } from "./ChapterFrame";

export function OurSongs() {
  const audio = useAudio();
  const { playedTracks } = useProgress();
  return (
    <ChapterFrame id="songs" index={2} title="A catalogue of small sounds" subtitle="Some of what plays in my head when I think of you.">
      <div className="max-w-3xl mx-auto">
        {songs.map((s, i) => {
          const isCurrent = audio.current?.id === s.id;
          const playing = isCurrent && audio.playing;
          const played = playedTracks.has(s.id);
          const num = String(s.order).padStart(2, "0");
          return (
            <SectionReveal key={s.id} delay={Math.min(i * 0.05, 0.3)} y={20}>
              <div className="group flex items-center gap-4 sm:gap-6 py-6 border-b border-gold/15 last:border-b-0">
                <span className="font-body text-gold/60 text-xs tabular-nums w-8 shrink-0">{num}</span>
                <div className="relative shrink-0">
                  <img src={s.cover_url} alt="" loading="lazy" className="w-16 h-16 sm:w-20 sm:h-20 object-cover object-[center_20%] rounded-sm" />
                  {playing && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-dashed border-gold/60"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display italic text-parchment text-2xl sm:text-3xl leading-tight truncate">{s.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-muted-foreground text-[11px] uppercase tracking-[0.25em] font-body truncate">{s.artist}</p>
                    {played && !playing && (
                      <span className="inline-flex items-center gap-1 text-gold/70 text-[9px] tracking-[0.25em] uppercase" aria-label="Played">
                        <Check className="w-2.5 h-2.5" aria-hidden /> played
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => (playing ? audio.toggle() : audio.play({ id: s.id, title: s.title, artist: s.artist, audio_url: s.audio_url, cover_url: s.cover_url }))}
                  className="w-12 h-12 shrink-0 rounded-full grid place-items-center ember-outline"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-[1px]" />}
                </button>
              </div>
            </SectionReveal>
          );
        })}
      </div>
    </ChapterFrame>
  );
}
