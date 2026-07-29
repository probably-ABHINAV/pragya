"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type EasterEggContextType = {
  foundHearts: number[];
  discoverHeart: (id: number) => void;
  totalHearts: number;
};

const EasterEggContext = createContext<EasterEggContextType | null>(null);

export function EasterEggProvider({ children }: { children: React.ReactNode }) {
  const [foundHearts, setFoundHearts] = useState<number[]>([]);
  const totalHearts = 10;

  useEffect(() => {
    const saved = localStorage.getItem("pragya_hearts");
    if (saved) {
      try {
        setFoundHearts(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const discoverHeart = (id: number) => {
    setFoundHearts((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem("pragya_hearts", JSON.stringify(next));
      return next;
    });
  };

  return (
    <EasterEggContext.Provider value={{ foundHearts, discoverHeart, totalHearts }}>
      {children}
    </EasterEggContext.Provider>
  );
}

export function useEasterEggs() {
  const ctx = useContext(EasterEggContext);
  if (!ctx) throw new Error("useEasterEggs must be used within EasterEggProvider");
  return ctx;
}
