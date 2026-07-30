import { useState, useRef, useEffect } from "react";
import { Music, VolumeX } from "lucide-react";
import { useAudio } from "@/hooks/useAudioPlayer";

export function MusicToggle() {
  const [on, setOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { playing: isChapterSongPlaying } = useAudio();

  useEffect(() => {
    if (!audioRef.current) return;
    
    if (on && !isChapterSongPlaying) {
      audioRef.current.play().catch(() => setOn(false));
    } else {
      audioRef.current.pause();
    }
  }, [on, isChapterSongPlaying]);

  return (
    <>
      <audio ref={audioRef} src="/audio/intrumental.mp3" loop preload="auto" />
      <button
        onClick={() => setOn((v) => !v)}
        className={`fixed top-4 right-4 z-40 w-11 h-11 rounded-full grid place-items-center backdrop-blur md:right-6 md:top-6 transition-colors ${on && !isChapterSongPlaying ? "bg-gold/10 border border-gold/50 text-gold shadow-[0_0_15px_rgba(255,215,0,0.2)]" : "ember-outline text-parchment/60"}`}
        aria-label={on ? "Pause background music" : "Play background music"}
        title={on ? "music on" : "music off"}
      >
        {on && !isChapterSongPlaying ? <Music className="w-4 h-4 animate-[pulse_2s_ease-in-out_infinite]" /> : <VolumeX className="w-4 h-4" />}
      </button>
    </>
  );
}
