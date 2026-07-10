import { Play, Pause } from "lucide-react";
import { motion } from "motion/react";
import { useAudio } from "@/hooks/useAudioPlayer";
import { dailyContent } from "@/data/pragya";
import { daysUntil, isUnlocked } from "@/lib/countdown";
import { ChapterFrame, SectionReveal } from "./ChapterFrame";
import { WaxSeal } from "./WaxSeal";

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-5">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          animate={active ? { scaleY: [0.3, 1, 0.4, 0.85, 0.3] } : { scaleY: 0.3 }}
          transition={active ? { duration: 1 + (i % 4) * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.04 } : {}}
          className="w-[2px] bg-ember rounded-full origin-center h-full"
        />
      ))}
    </div>
  );
}

// Perforated top edge like a ticket stub
function Perforation() {
  return (
    <svg viewBox="0 0 400 8" preserveAspectRatio="none" className="w-full h-2 text-background" aria-hidden>
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={5 + i * 10} cy={0} r={3} fill="currentColor" />
      ))}
    </svg>
  );
}

export function DailyNotes() {
  const audio = useAudio();
  const weeks = [
    { label: "Week One", days: dailyContent.slice(0, 7) },
    { label: "Week Two", days: dailyContent.slice(7, 14) },
    { label: "Week Three", days: dailyContent.slice(14, 21) },
    { label: "Week Four", days: dailyContent.slice(21, 28) },
    { label: "The Final Days", days: dailyContent.slice(28) },
  ];

  return (
    <ChapterFrame id="daily" index={2} title="Thirty-one small offerings" subtitle="One voice note from me, unsealing one at a time until the day arrives.">
      <div className="max-w-2xl mx-auto space-y-14">
        {weeks.map((wk, wi) => (
          <div key={wk.label}>
            <SectionReveal>
              <p className="eyebrow mb-4 text-center">{wk.label}</p>
            </SectionReveal>
            <div className="space-y-3">
              {wk.days.map((d, i) => {
                const unlocked = isUnlocked(d.date);
                const trackId = `day-${d.day}`;
                const isCurrent = audio.current?.id === trackId;
                const playing = isCurrent && audio.playing;
                return (
                  <SectionReveal key={d.day} delay={Math.min((wi * 0.02) + i * 0.02, 0.3)} y={16}>
                    <div className="relative overflow-hidden rounded-sm border border-gold/15 bg-card/50 backdrop-blur-sm shadow-[0_2px_24px_-16px_rgba(232,184,74,0.4)]">
                      <div className="text-background/60"><Perforation /></div>
                      <div className={`flex items-center gap-4 px-4 sm:px-6 pb-4 pt-3 ${unlocked ? "" : "opacity-75"}`}>
                        <div className="flex flex-col items-center justify-center w-14 shrink-0 border-r border-gold/15 pr-4">
                          <span className="eyebrow text-[9px]">day</span>
                          <span className="font-display italic text-4xl text-gold leading-none">{d.day}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-display italic text-xl text-parchment truncate">{unlocked ? d.message : "sealed for now"}</p>
                          <p className="text-muted-foreground text-[10px] uppercase tracking-widest mt-1 font-body">
                            {unlocked
                              ? "unsealed · tap to listen"
                              : `sealed · unlocks in ${daysUntil(d.date)} day${daysUntil(d.date) === 1 ? "" : "s"}`}
                          </p>
                        </div>
                        <div className="shrink-0">
                          {unlocked ? (
                            <button
                              onClick={() => playing ? audio.toggle() : audio.play({ id: trackId, title: `Day ${d.day}`, audio_url: d.voice_note_url })}
                              className="relative flex items-center gap-3 ember-outline rounded-sm pl-3 pr-4 py-2"
                              aria-label={playing ? "Pause" : "Play"}
                            >
                              {playing && <span className="absolute inset-0 rounded-sm border border-ember animate-heartbeat" aria-hidden />}
                              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              <div className="w-14"><Waveform active={playing} /></div>
                            </button>
                          ) : (
                            <div className="shrink-0"><WaxSeal size={40} /></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </SectionReveal>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ChapterFrame>
  );
}
