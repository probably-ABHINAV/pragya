"use client";

import { AudioProvider } from "@/hooks/useAudioPlayer";
import { PassphraseGate } from "@/components/pragya/PassphraseGate";
import { Hero } from "@/components/pragya/Hero";
import { DailyNotes } from "@/components/pragya/DailyNotes";
import { OurSongs } from "@/components/pragya/OurSongs";
import { OurStory } from "@/components/pragya/OurStory";
import { MemoryVault } from "@/components/pragya/MemoryVault";
import { Letters } from "@/components/pragya/Letters";
import { GuessGame } from "@/components/pragya/GuessGame";
import { Footer } from "@/components/pragya/Footer";
import { MusicToggle } from "@/components/pragya/MusicToggle";
import { MiniPlayer } from "@/components/pragya/MiniPlayer";
import { ChapterRail } from "@/components/pragya/ChapterRail";
import { CursorGlow } from "@/components/pragya/CursorGlow";
import { A11yProvider } from "@/components/pragya/A11yPanel";
import { ProgressProvider } from "@/hooks/useProgress";
import { ProgressHUD } from "@/components/pragya/ProgressHUD";
import { AudioProgressBridge } from "@/components/pragya/AudioProgressBridge";

export default function Page() {
  return (
    <PassphraseGate>
      <A11yProvider>
        <ProgressProvider>
          <AudioProvider>
            <AudioProgressBridge />
            <main id="main" className="bg-harvest min-h-screen scroll-smooth relative">
              <CursorGlow />
              <ChapterRail />
              <ProgressHUD />
              <MusicToggle />
              <Hero />
              <DailyNotes />
              <OurSongs />
              <OurStory />
              <MemoryVault />
              <Letters />
              <GuessGame />
              <Footer />
              <MiniPlayer />
            </main>
          </AudioProvider>
        </ProgressProvider>
      </A11yProvider>
    </PassphraseGate>
  );
}
