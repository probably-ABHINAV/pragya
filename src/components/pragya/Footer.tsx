import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, BookOpen } from "lucide-react";
import { Ornament } from "./Ornament";
import { useEasterEggs } from "@/hooks/useEasterEggs";
import { HiddenHeart } from "./HiddenHeart";

export function Footer() {
  const [showFinal, setShowFinal] = useState(false);
  const { foundHearts, totalHearts } = useEasterEggs();
  const allFound = foundHearts.length === totalHearts;

  return (
    <footer id="footer" data-chapter={8} className="relative py-32 px-6 text-center bg-harvest min-h-screen flex flex-col items-center justify-center">
      <div className="absolute top-8 right-8 z-30">
        <HiddenHeart id={7} message="You found the last one." />
      </div>

      <div className="flex justify-center mb-8"><Ornament className="w-56 text-gold/50" /></div>
      
      <p className="eyebrow text-parchment/60 mb-6">Chapter 8: The Last Gift</p>
      
      <div className="max-w-2xl mx-auto space-y-6 text-parchment font-display italic text-2xl sm:text-3xl leading-relaxed mb-16">
        <p>If you've reached this page,</p>
        <p>thank you for walking through our story.</p>
        <p>Everything before this was memories.</p>
        <p className="text-gold">This is my heart.</p>
      </div>

      <button
        onClick={() => setShowFinal(true)}
        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-parchment/5 border border-gold/30 hover:bg-gold/10 hover:border-gold/60 transition-all duration-500 rounded-sm overflow-hidden"
      >
        <div className="absolute inset-0 bg-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        <BookOpen className="w-5 h-5 text-gold relative z-10" />
        <span className="font-body uppercase tracking-[0.2em] text-sm text-parchment relative z-10">Open The Book</span>
      </button>

      <div className="mt-12 p-6 border border-ember/20 bg-ember/5 max-w-sm mx-auto text-sm font-body text-parchment/70 leading-loose">
        <p className="eyebrow text-ember mb-3">Warning:</p>
        <p>Contains excessive love,</p>
        <p>questionable humour,</p>
        <p>Virat Kohli references,</p>
        <p>and one very lucky boyfriend.</p>
      </div>

      <AnimatePresence>
        {allFound && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-24 p-8 border border-gold/40 bg-gold/5 max-w-md mx-auto"
          >
            <p className="font-display italic text-2xl text-gold mb-4">Achievement Unlocked</p>
            <p className="text-parchment/80 font-body mb-6">You found all 10 hidden hearts.</p>
            <p className="eyebrow text-gold/60 mb-2">Reward:</p>
            <p className="text-parchment font-body italic text-lg">Official Birthday Girl ❤️</p>
            <p className="text-parchment/50 font-body text-xs mt-2 uppercase tracking-widest">Lifetime access granted.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFinal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] bg-black text-parchment flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,30,20,1)_0%,rgba(0,0,0,1)_100%)] pointer-events-none" />
            <div className="absolute inset-0 grain pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1.5 }}
              className="relative z-10 max-w-2xl mx-auto"
            >
              <h1 className="font-display italic text-5xl sm:text-7xl text-gold mb-12">
                Happy 20th Birthday, Pragya.
              </h1>
              
              <div className="space-y-6 font-display italic text-2xl sm:text-4xl text-parchment/80 mb-16 leading-relaxed">
                <p>From strangers,</p>
                <p>to friends,</p>
                <p>to enemies,</p>
                <p>to best friends,</p>
                <p className="text-parchment scale-110 origin-center text-3xl sm:text-5xl my-8 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">to love.</p>
              </div>

              <div className="space-y-4 font-display italic text-3xl sm:text-5xl text-gold/90 mb-12">
                <p>I'd choose this story again.</p>
                <p>Every single time.</p>
              </div>

              <p className="font-display italic text-4xl sm:text-6xl text-ember drop-shadow-[0_0_20px_rgba(255,100,100,0.4)] mt-12">
                — Karunya ❤️
              </p>
            </motion.div>

            <button
              onClick={() => setShowFinal(false)}
              className="absolute top-8 right-8 text-parchment/40 hover:text-parchment transition-colors z-20 eyebrow"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
