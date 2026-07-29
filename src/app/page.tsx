"use client";

import { AudioProvider } from "@/hooks/useAudioPlayer";
import { PassphraseGate } from "@/components/pragya/PassphraseGate";
import { Hero } from "@/components/pragya/Hero";

import { OurSongs } from "@/components/pragya/OurSongs";
import { OurStory } from "@/components/pragya/OurStory";
import { MemoryVault } from "@/components/pragya/MemoryVault";
import { MovieReel } from "@/components/pragya/MovieReel";
import { Letters } from "@/components/pragya/Letters";
import { GameSection } from "@/components/pragya/GameSection";
import { Footer } from "@/components/pragya/Footer";
import { MusicToggle } from "@/components/pragya/MusicToggle";
import { MiniPlayer } from "@/components/pragya/MiniPlayer";
import { ChapterRail } from "@/components/pragya/ChapterRail";
import { CursorGlow } from "@/components/pragya/CursorGlow";
import { A11yProvider } from "@/components/pragya/A11yPanel";
import { ProgressProvider } from "@/hooks/useProgress";
import { ProgressHUD } from "@/components/pragya/ProgressHUD";
import { AudioProgressBridge } from "@/components/pragya/AudioProgressBridge";
import { EasterEggProvider } from "@/hooks/useEasterEggs";
import { useEffect } from "react";
import { BIRTHDAY } from "@/lib/countdown";

export default function Page() {
  useEffect(() => {
    const checkTheme = () => {
      if (Date.now() >= BIRTHDAY.getTime()) {
        document.documentElement.setAttribute("data-theme", "birthday");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    };
    checkTheme();
    const id = setInterval(checkTheme, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <PassphraseGate>
      <A11yProvider>
        <ProgressProvider>
          <AudioProvider>
            <EasterEggProvider>
              <AudioProgressBridge />
            <main id="main" className="bg-harvest min-h-screen scroll-smooth relative">
              <CursorGlow />
              <ChapterRail />
              <ProgressHUD />
              <MusicToggle />
              <Hero />

              <OurSongs />
              <OurStory />
              <MemoryVault />
              <MovieReel />
              <Letters />
              <GameSection />
              <Footer />
              <MiniPlayer />
            </main>
            </EasterEggProvider>
          </AudioProvider>
        </ProgressProvider>
      </A11yProvider>
    </PassphraseGate>
  );
}
