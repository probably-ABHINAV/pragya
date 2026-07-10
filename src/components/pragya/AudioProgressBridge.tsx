import { useEffect, useRef } from "react";
import { useAudio } from "@/hooks/useAudioPlayer";
import { useProgress } from "@/hooks/useProgress";
import { songs, dailyContent, type Song } from "@/data/pragya";

type Track = { id: string; title: string; artist?: string; audio_url: string; cover_url?: string };

const songToTrack = (s: Song): Track => ({
  id: s.id, title: s.title, artist: s.artist, audio_url: s.audio_url, cover_url: s.cover_url,
});

const findTrack = (id: string): Track | null => {
  const s = songs.find((s) => s.id === id);
  if (s) return songToTrack(s);
  const d = dailyContent.find((d) => `day-${d.day}` === id);
  if (d) return { id: `day-${d.day}`, title: `Day ${d.day}`, audio_url: d.voice_note_url };
  return null;
};

/**
 * Bridges the audio player with persisted progress:
 * - On mount, if we have a saved last-played id and no current track,
 *   preload it so the MiniPlayer rehydrates in a paused state.
 * - Whenever the current track changes, mark it as played and remember it.
 */
export function AudioProgressBridge() {
  const audio = useAudio();
  const progress = useProgress();
  const hydrated = useRef(false);

  // Hydrate once
  useEffect(() => {
    if (hydrated.current) return;
    if (audio.current) { hydrated.current = true; return; }
    if (!progress.lastPlayedId) return;
    const t = findTrack(progress.lastPlayedId);
    if (t) {
      audio.preload(t);
      hydrated.current = true;
    }
  }, [audio, progress.lastPlayedId]);

  // Sync outgoing changes
  useEffect(() => {
    if (!audio.current) return;
    progress.setLastPlayed(audio.current.id);
    progress.markTrack(audio.current.id);
  }, [audio.current, progress]);

  return null;
}
