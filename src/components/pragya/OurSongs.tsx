import { useState } from "react";
import { Play, Pause, Check, Music } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { songs } from "@/data/pragya";
import { useAudio } from "@/hooks/useAudioPlayer";
import { useProgress } from "@/hooks/useProgress";
import { ChapterFrame, SectionReveal } from "./ChapterFrame";
import { HiddenHeart } from "./HiddenHeart";

export function OurSongs() {
  const audio = useAudio();
  const { playedTracks } = useProgress();
  const [showSecretSong, setShowSecretSong] = useState(false);

  return (
    <ChapterFrame id="songs" index={2} title="THE SOUNDTRACK OF US" subtitle="Some of what plays in my head when I think of you.">
      <div className="max-w-3xl mx-auto mb-6 flex justify-end px-4">
        <HiddenHeart id={2} message="Thank you for choosing me." />
      </div>

      <div className="max-w-3xl mx-auto relative">
        <button 
          onClick={() => setShowSecretSong(true)}
          className="absolute -top-12 right-0 text-gold/20 hover:text-gold transition-colors"
          aria-label="A small secret"
        >
          <Music className="w-4 h-4" />
        </button>

        <AnimatePresence>
          {showSecretSong && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -top-24 right-0 bg-harvest border border-gold/20 p-4 shadow-xl z-20 max-w-xs"
            >
              <p className="eyebrow text-gold/60 mb-2">Song I never found:</p>
              <p className="font-display italic text-parchment text-lg mb-2">The song that perfectly explains you.</p>
              <p className="font-body text-parchment/60 text-sm">Still searching...</p>
              <button 
                onClick={() => setShowSecretSong(false)}
                className="absolute top-2 right-2 text-gold/40 hover:text-gold"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {songs.map((s, i) => {
          const isCurrent = audio.current?.id === s.id;
          const playing = isCurrent && audio.playing;
          const played = playedTracks.has(s.id);
          const num = String(s.order).padStart(2, "0");
          return (
            <SectionReveal key={s.id} delay={Math.min(i * 0.05, 0.3)} y={20}>
              <div className="group flex flex-col sm:flex-row gap-4 sm:gap-6 py-8 border-b border-gold/15 last:border-b-0">
                <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                  <span className="font-body text-gold/60 text-xs tabular-nums w-8 shrink-0">{num}</span>
                  <div className="relative shrink-0">
                    <img src={s.cover_url} alt="" loading="lazy" className="w-16 h-16 sm:w-20 sm:h-20 object-cover object-center rounded-sm" />
                    {playing && (
                      <motion.div
                        className="absolute inset-0 rounded-sm border-2 border-dashed border-gold/60"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </div>
                </div>
                
                <div className="min-w-0 flex-1 pl-12 sm:pl-0 flex flex-col justify-center">
                  <div className="flex items-start justify-between gap-4">
                    <div>
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
                      className="w-12 h-12 shrink-0 rounded-full grid place-items-center ember-outline border border-gold/20"
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      {playing ? <Pause className="w-4 h-4 text-parchment" /> : <Play className="w-4 h-4 translate-x-[1px] text-parchment" />}
                    </button>
                  </div>
                  
                  {s.why && (
                    <div className="mt-4 pl-4 border-l-2 border-gold/20">
                      <p className="font-body text-sm text-parchment/70 italic">
                        "{s.why}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </SectionReveal>
          );
        })}
      </div>
    </ChapterFrame>
  );
}
