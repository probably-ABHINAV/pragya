import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen } from "lucide-react";
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
        <span className="font-body uppercase tracking-[0.2em] text-sm text-parchment relative z-10">Open the letter</span>
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
            className="fixed inset-0 z-[100] bg-black text-parchment flex flex-col items-center overflow-y-auto"
          >
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(40,30,20,1)_0%,rgba(0,0,0,1)_100%)] pointer-events-none" />
            <div className="fixed inset-0 grain pointer-events-none" />
            
            <button
              onClick={() => setShowFinal(false)}
              className="fixed top-8 right-8 text-parchment/40 hover:text-parchment transition-colors z-20 eyebrow bg-black/50 p-2 rounded-full backdrop-blur-sm"
            >
              Close
            </button>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="relative z-10 w-full max-w-3xl mx-auto py-24 px-6 sm:px-12 text-left"
            >
              <h1 className="font-display italic text-5xl sm:text-6xl text-gold mb-16 text-center">
                Happy P-Day. ❤️
              </h1>
              
              <div className="space-y-8 font-body text-lg sm:text-xl text-parchment/90 leading-relaxed font-light">
                <p>
                  I honestly don't know where to start or what to say about you, because any words, even a book, even an encyclopedia, would be less than what I want to say about you, what I see in you, and what you truly are.
                </p>
                <p>
                  Firstly, a very, very, very happy birthday to you, my babo, my Mrs. Sharma, my kuchu kuchu, my cutie pie, my shona, all the cringy names, my world, my everything.
                </p>
                <p>
                  You have always been my true supporter, my heart and soul in everything I do. Thank you for supporting me through my CFA exam, for helping me clear it, and for making me feel so special on my birthday. Regardless of all the arguments, all the disappointments, all the mistakes and everything that has happened in the past, you were still there.
                </p>
                <p>
                  I know it's never easy for you to forget things, and honestly, I never want that either. I just want you to forgive me. I really want to take things forward with you. I want the real Pragya, the one who is completely free with me, the one who doesn't have to pretend anymore, the one who can simply be the little one.
                </p>

                <div className="my-12 py-8 border-y border-gold/20 text-center space-y-2 font-display italic text-2xl text-gold/90 bg-gold/5">
                  <p>वो कहते हैं ना,</p>
                  <p className="mt-4">चाँद की रोशनी सी है जिसकी आँखें,</p>
                  <p>अदाएं खास रखती है वो,</p>
                  <p>हर लिबास जचता है उस पर,</p>
                  <p>हर रंग में कमाल लगती है वो।</p>
                </div>

                <p>
                  And that really suits you.
                </p>
                <p>
                  Not just these lines, not just the outward beauty, but I genuinely feel that all the Bollywood songs, all the Hollywood movies, every beautiful thing ever written or created, somehow reminds me of you. As if they were made exclusively for you.
                </p>
                <p>
                  And one thing I once read that I could relate to so much:
                </p>

                <div className="my-12 py-8 border-y border-gold/20 text-center space-y-2 font-display italic text-2xl text-gold/90 bg-gold/5">
                  <p>अपनी निगाहों से न देखो खुद को,</p>
                  <p>हीरा भी तुझे पत्थर लगेगा।</p>
                  <p>सब कहते होंगे चाँद का टुकड़ा है तू,</p>
                  <p>मेरी नजर से देख, चाँद भी तेरा टुकड़ा लगेगा।</p>
                </div>

                <p>
                  That really explains everything.
                </p>
                <p>
                  You never truly know how genuine, how kind, how generous, how classy, how royal, how beautiful, how hot, how cute you are to me. How you feel like a goddess to me in every way — in your actions, in your heart, and yes, physically too. But you never have my eyes to see yourself the way I do.
                </p>

                <div className="my-12 py-8 border-y border-gold/20 text-center space-y-2 font-display italic text-2xl text-gold/90 bg-gold/5">
                  <p>तेरी तारीफ में क्या-क्या नहीं बोलूँ,</p>
                  <p>तुझे देखते ही चेहरा यूँ खिल जाता है,</p>
                  <p>जैसे तेरे होने से सब कुछ मिल जाता है।</p>
                  <p className="mt-6">कैसे बताऊँ तुझको तू क्या है मेरे लिए।</p>
                  <p>तुझे बस एक बार देख लूँ तो पूरा मेरा दिन बन जाता है।</p>
                  <p>क्योंकि तेरे जैसा कोई मिला ही नहीं।</p>
                  <p>कैसे मिलता, कहीं पे था ही नहीं।</p>
                  <p>तू जहाँ तक दिखाई देता है,</p>
                  <p>उसके आगे मैंने देखा ही नहीं।</p>
                </div>

                <p className="text-2xl sm:text-3xl text-ember font-display italic text-center py-4">
                  I really love you, Pragya.
                </p>

                <p>
                  And finally, this is the start of a journey towards more togetherness. The first stepping stone of our future life together — our twenties.
                </p>
                <p>
                  These twenties will define so much for us, and I want you to stay strong the way you always have. I want you to stay with me and never give up on me, like you never do, because I would never, ever do that.
                </p>
                <p>
                  You know, right?
                </p>
                <p className="text-center font-display italic text-2xl text-gold py-4">
                  You are my sunshine, my only sunshine.<br />
                  You make me happy when skies are gray.
                </p>
                <p>
                  And forever, you will be my sunshine.
                </p>
                <p>
                  Honestly, I can keep writing and writing, and this paragraph would never end.
                </p>
                <p>
                  I just want to relive everything I have had with you.
                </p>
                
                <p className="leading-loose text-justify">
                  You are so elegant, so breathtaking, so divine, so alluring, so pleasing, so lovely, so delightful, so appealing, so engaging, so captivating, so fabulous, so prime, top-notch, sensational, premium, attractive, charming, heavily stunning, executive, cute, magnificent, winsome, ravishing, gorgeous, glamorous, irresistible, graceful, aesthetic, hot, sexy, dazzling, fascinating, so fine like a straight line, good-looking, jaw-dropping, grand, splendid, superb, wonderful, sublime, radiant, ideal, excellent, classy, old money, admirable, fancy, angelic, flawless, perfect, desirable, striking, show-stopping, glossy, eye-magnetic, captivating, bright, my light, dollish, enchanting — my world.
                </p>

                <p className="text-center font-display italic text-2xl text-gold mt-12">
                  All in all, you are God's masterpiece that couldn't be made again.
                </p>

                <p>
                  I hope God's plan for you is successful. I hope you achieve everything you want in life. And I will be there for you in every way I can.
                </p>
                <p className="text-center font-display italic text-2xl text-gold/90">
                  You complete me and I complete you.
                </p>
                <p>
                  You give me wings the way Red Bull claims to give wings. You give me wings for everything I want to achieve.
                </p>
                <p className="text-center text-xl text-parchment font-medium uppercase tracking-widest mt-12 mb-8">
                  We are, we will, and we will always be happy.
                </p>

              </div>

              <div className="mt-24 text-center pb-24">
                <p className="font-display italic text-5xl sm:text-7xl text-gold mb-6 drop-shadow-lg">
                  Happy Birthday, Pragya.
                </p>
                <p className="font-display italic text-3xl sm:text-4xl text-ember">
                  — Karunya
                </p>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
