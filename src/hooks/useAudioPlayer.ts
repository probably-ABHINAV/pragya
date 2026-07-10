import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, createElement } from "react";

type Track = { id: string; title: string; artist?: string; audio_url: string; cover_url?: string };

type Ctx = {
  current: Track | null;
  playing: boolean;
  currentTime: number;
  duration: number;
  play: (t: Track) => void;
  preload: (t: Track) => void;
  toggle: () => void;
  stop: () => void;
  seek: (t: number) => void;
  getFrequencyData: () => Uint8Array | null;
};

const AudioCtx = createContext<Ctx | null>(null);
const CROSSFADE_MS = 900;

export function AudioProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Two <audio> tags so we can crossfade between them
  const els = useRef<HTMLAudioElement[]>([]);
  const gains = useRef<GainNode[]>([]);
  const analyser = useRef<AnalyserNode | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const active = useRef(0);
  const fadeTimer = useRef<number | null>(null);

  // Init audio elements once
  useEffect(() => {
    if (typeof window === "undefined" || els.current.length) return;
    for (let i = 0; i < 2; i++) {
      const a = new Audio();
      a.crossOrigin = "anonymous";
      a.preload = "auto";
      els.current.push(a);
    }
    const onEnd = () => setPlaying(false);
    els.current.forEach((a) => a.addEventListener("ended", onEnd));
    return () => els.current.forEach((a) => a.removeEventListener("ended", onEnd));
  }, []);

  // Lazily build WebAudio graph on first user gesture
  const ensureGraph = useCallback(() => {
    if (audioCtx.current || typeof window === "undefined") return;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const an = ctx.createAnalyser();
      an.fftSize = 128;
      an.smoothingTimeConstant = 0.82;
      an.connect(ctx.destination);
      els.current.forEach((el) => {
        const src = ctx.createMediaElementSource(el);
        const g = ctx.createGain();
        g.gain.value = 0;
        src.connect(g).connect(an);
        gains.current.push(g);
      });
      audioCtx.current = ctx;
      analyser.current = an;
    } catch {
      /* CORS / already-connected — visualiser will fall back to synthetic */
    }
  }, []);

  // Track time only from the *active* element
  useEffect(() => {
    const id = window.setInterval(() => {
      const a = els.current[active.current];
      if (!a) return;
      setCurrentTime(a.currentTime || 0);
      if (a.duration && Number.isFinite(a.duration)) setDuration(a.duration);
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  const rampGain = (g: GainNode | undefined, to: number, ms: number) => {
    if (!g || !audioCtx.current) return;
    const now = audioCtx.current.currentTime;
    const from = g.gain.value;
    g.gain.cancelScheduledValues(now);
    g.gain.setValueAtTime(from, now);
    g.gain.linearRampToValueAtTime(to, now + ms / 1000);
  };

  const play = (t: Track) => {
    ensureGraph();
    if (audioCtx.current?.state === "suspended") audioCtx.current.resume().catch(() => {});
    const cur = els.current[active.current];

    // Same track — just resume
    if (current?.id === t.id) {
      cur?.play().catch(() => {});
      rampGain(gains.current[active.current], 1, 120);
      setPlaying(true);
      return;
    }

    // Crossfade: incoming on the other element, outgoing fades out
    const nextIdx = 1 - active.current;
    const nextEl = els.current[nextIdx];
    if (!nextEl) return;
    nextEl.src = t.audio_url;
    nextEl.currentTime = 0;
    nextEl.play().catch(() => {});

    // If there was no active track, just fade in fast; otherwise real crossfade
    const hasPrev = !!current && !!cur;
    const ms = hasPrev ? CROSSFADE_MS : 250;
    if (gains.current.length) {
      gains.current[nextIdx].gain.value = 0;
      rampGain(gains.current[nextIdx], 1, ms);
      if (hasPrev) rampGain(gains.current[active.current], 0, ms);
    }
    if (fadeTimer.current) window.clearTimeout(fadeTimer.current);
    if (hasPrev) {
      fadeTimer.current = window.setTimeout(() => cur?.pause(), ms + 40);
    }

    active.current = nextIdx;
    setCurrent(t);
    setPlaying(true);
    setCurrentTime(0);
    setDuration(0);
  };

  const toggle = () => {
    const a = els.current[active.current];
    if (!a || !current) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      ensureGraph();
      audioCtx.current?.resume().catch(() => {});
      a.play().catch(() => {});
      rampGain(gains.current[active.current], 1, 200);
      setPlaying(true);
    }
  };

  const stop = () => {
    const a = els.current[active.current];
    if (a) {
      rampGain(gains.current[active.current], 0, 250);
      window.setTimeout(() => a.pause(), 260);
    }
    setPlaying(false);
    setCurrent(null);
    setCurrentTime(0);
    setDuration(0);
  };

  // Load a track into the active element without playing — used to restore
  // the last-played song from localStorage so the mini-player rehydrates.
  const preload = (t: Track) => {
    if (current?.id === t.id) return;
    const a = els.current[active.current];
    if (a) {
      a.src = t.audio_url;
      a.currentTime = 0;
      a.pause();
    }
    setCurrent(t);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const seek = (t: number) => {
    const a = els.current[active.current];
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(t, a.duration || t));
    setCurrentTime(a.currentTime);
  };

  const freqBuf = useRef<Uint8Array | null>(null);
  const getFrequencyData = () => {
    const an = analyser.current;
    if (!an) return null;
    if (!freqBuf.current || freqBuf.current.length !== an.frequencyBinCount) {
      freqBuf.current = new Uint8Array(an.frequencyBinCount);
    }
    an.getByteFrequencyData(freqBuf.current as unknown as Uint8Array<ArrayBuffer>);
    return freqBuf.current;
  };

  return createElement(
    AudioCtx.Provider,
    { value: { current, playing, currentTime, duration, play, preload, toggle, stop, seek, getFrequencyData } },
    children,
  );
}

export function useAudio() {
  const c = useContext(AudioCtx);
  if (!c) throw new Error("useAudio must be used inside AudioProvider");
  return c;
}
