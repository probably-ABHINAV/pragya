import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode, createElement } from "react";

const KEY = "fp:progress";

type Persisted = {
  chapters: string[];
  letters: string[];
  tracks: string[];
  lastPlayedId: string | null;
  furthestChapterIndex: number;
};

const empty: Persisted = {
  chapters: [],
  letters: [],
  tracks: [],
  lastPlayedId: null,
  furthestChapterIndex: 0,
};

type Ctx = {
  visitedChapters: Set<string>;
  openedLetters: Set<string>;
  playedTracks: Set<string>;
  lastPlayedId: string | null;
  furthestChapterIndex: number;
  markChapter: (id: string, index: number) => void;
  markLetter: (id: string) => void;
  markTrack: (id: string) => void;
  setLastPlayed: (id: string | null) => void;
  reset: () => void;
};

const ProgressCtx = createContext<Ctx | null>(null);

function load(): Persisted {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(empty);

  // hydrate after mount to avoid SSR mismatch
  useEffect(() => { setState(load()); }, []);

  // persist
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota / private mode */ }
  }, [state]);

  const markChapter = useCallback((id: string, index: number) => {
    setState((s) => {
      if (s.chapters.includes(id) && index <= s.furthestChapterIndex) return s;
      return {
        ...s,
        chapters: s.chapters.includes(id) ? s.chapters : [...s.chapters, id],
        furthestChapterIndex: Math.max(s.furthestChapterIndex, index),
      };
    });
  }, []);

  const markLetter = useCallback((id: string) => {
    setState((s) => (s.letters.includes(id) ? s : { ...s, letters: [...s.letters, id] }));
  }, []);

  const markTrack = useCallback((id: string) => {
    setState((s) => (s.tracks.includes(id) ? s : { ...s, tracks: [...s.tracks, id] }));
  }, []);

  const setLastPlayed = useCallback((id: string | null) => {
    setState((s) => (s.lastPlayedId === id ? s : { ...s, lastPlayedId: id }));
  }, []);

  const reset = useCallback(() => setState(empty), []);

  const value = useMemo<Ctx>(() => ({
    visitedChapters: new Set(state.chapters),
    openedLetters: new Set(state.letters),
    playedTracks: new Set(state.tracks),
    lastPlayedId: state.lastPlayedId,
    furthestChapterIndex: state.furthestChapterIndex,
    markChapter, markLetter, markTrack, setLastPlayed, reset,
  }), [state, markChapter, markLetter, markTrack, setLastPlayed, reset]);

  return createElement(ProgressCtx.Provider, { value }, children);
}

export function useProgress() {
  const c = useContext(ProgressCtx);
  if (!c) throw new Error("useProgress must be used inside ProgressProvider");
  return c;
}
