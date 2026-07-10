import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Accessibility, X } from "lucide-react";

type A11yState = { reduceMotion: boolean; highContrast: boolean };
const Ctx = createContext<A11yState>({ reduceMotion: false, highContrast: false });
export const useA11y = () => useContext(Ctx);

const KEY = "fp:a11y";

export function A11yProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<A11yState>({ reduceMotion: false, highContrast: false });
  const [open, setOpen] = useState(false);

  // hydrate from storage + system pref
  useEffect(() => {
    if (typeof window === "undefined") return;
    let initial: A11yState = { reduceMotion: false, highContrast: false };
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) initial = { ...initial, ...JSON.parse(raw) };
    } catch {}
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) initial.reduceMotion = true;
    if (window.matchMedia("(prefers-contrast: more)").matches) initial.highContrast = true;
    setState(initial);
  }, []);

  // reflect to <html> + persist
  useEffect(() => {
    const el = document.documentElement;
    el.toggleAttribute("data-reduce-motion", state.reduceMotion);
    el.toggleAttribute("data-high-contrast", state.highContrast);
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const toggle = (k: keyof A11yState) => setState((s) => ({ ...s, [k]: !s[k] }));

  return (
    <Ctx.Provider value={state}>
      {/* Skip link */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only fixed top-2 left-2 z-[200] bg-parchment text-wine px-4 py-2 rounded-sm font-body text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold"
      >
        Skip to content
      </a>

      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed top-4 left-4 md:top-6 md:left-6 z-[90] w-11 h-11 rounded-full grid place-items-center ember-outline backdrop-blur"
        aria-label="Accessibility settings"
        aria-expanded={open}
        aria-controls="a11y-panel"
      >
        <Accessibility className="w-4 h-4" />
      </button>

      {open && (
        <div
          id="a11y-panel"
          role="dialog"
          aria-label="Accessibility settings"
          className="fixed top-16 left-4 md:top-20 md:left-6 z-[90] w-72 rounded-sm border border-gold/30 bg-card/95 backdrop-blur p-5 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="eyebrow">Accessibility</p>
            <button onClick={() => setOpen(false)} aria-label="Close settings" className="text-parchment/60 hover:text-parchment">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <Toggle
              label="Reduce motion"
              hint="Pause embers, glow, and transitions."
              checked={state.reduceMotion}
              onChange={() => toggle("reduceMotion")}
            />
            <Toggle
              label="Higher contrast"
              hint="Brighter text and stronger borders."
              checked={state.highContrast}
              onChange={() => toggle("highContrast")}
            />
          </div>
          <p className="mt-5 text-[10px] text-parchment/50 font-body leading-relaxed">
            Tip: press <kbd className="px-1 border border-gold/30 rounded-sm">Tab</kbd> to move between controls,
            <kbd className="ml-1 px-1 border border-gold/30 rounded-sm">↑</kbd>
            <kbd className="px-1 border border-gold/30 rounded-sm">↓</kbd> on the chapter rail.
          </p>
        </div>
      )}

      {children}
    </Ctx.Provider>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-start justify-between gap-3 cursor-pointer group">
      <span className="flex-1">
        <span className="block text-parchment font-display italic text-lg leading-tight">{label}</span>
        <span className="block text-parchment/55 text-[11px] font-body mt-0.5">{hint}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative shrink-0 mt-1 w-10 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${checked ? "bg-ember" : "bg-parchment/20"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-parchment transition-transform ${checked ? "translate-x-4" : ""}`} />
      </button>
    </label>
  );
}
