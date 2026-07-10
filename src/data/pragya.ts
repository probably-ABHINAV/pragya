// Mock data. Swap with Supabase later; keep shapes stable.

const silentAudio =
  "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQxAADB8AhSmxhIIEVCSiJrDCQBTcu3UrAIwUdkRgQbFAZC1CQEwTJ9mjRvBA4UOLD8nKVOWfh+UlK3z/177OXrfOdKl7pyn3Xf//WreyTRUoAWgBgkOAGbZHBgG1OF6zM82DWbZaUmMBptgQhGjsyYqc9ae9XFz84FfHks148pnfPHvHvHu/8fPvvvvvvzz9frHqf9v6zTWNvvvvvvvvv7vvvvv//7v/vv//7v//7v//7v//7v//7v//7";

export type DailyContent = { day: number; date: string; message: string; voice_note_url: string };
export type Song = { id: string; title: string; artist: string; audio_url: string; cover_url: string; order: number };
export type TimelineEvent = { id: string; date: string; caption: string; photo_url: string; order: number };
export type MemoryPhoto = { id: string; photo_url: string; caption: string; order: number };
export type Letter = { id: string; title: string; body: string; unlock_date: string };
export type GameQuestion = { id: string; photo_url: string; correct_location: string; wrong_options: string[]; hidden_note: string };

const img = (seed: string, w = 800, h = 800) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;

// 31 days leading to July 31, 2026 → July 1 through July 31, 2026
export const dailyContent: DailyContent[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const date = new Date(Date.UTC(2026, 6, day)).toISOString().slice(0, 10);
  const messages = [
    "Something small I love about you today.",
    "A memory I keep going back to.",
    "A song that reminds me of you.",
    "The way you laughed that one night.",
    "A wish I'm saving for later.",
    "The first time I knew.",
    "A thing you said that I never forgot.",
  ];
  return {
    day,
    date,
    message: messages[i % messages.length],
    voice_note_url: silentAudio,
  };
});

export const dailyMessages: string[] = [
  "You made today softer, just by existing.",
  "Everything is warmer when I'm thinking about you.",
  "I hope the morning felt like a small kindness.",
  "Some days are just for missing you a little.",
  "The world is a better version of itself with you in it.",
  "I keep finding new reasons, quietly.",
  "You are my favorite habit.",
];

export const songs: Song[] = [
  { id: "s1", title: "Our First Song", artist: "Placeholder Artist", audio_url: silentAudio, cover_url: img("1470229722913-7c0e2dbbafd3", 400, 400), order: 1 },
  { id: "s2", title: "Late Drive Home", artist: "Placeholder Artist", audio_url: silentAudio, cover_url: img("1511671782779-c97d3d27a1d4", 400, 400), order: 2 },
  { id: "s3", title: "Kitchen Slow Dance", artist: "Placeholder Artist", audio_url: silentAudio, cover_url: img("1514320291840-2e0a9bf2a9ae", 400, 400), order: 3 },
  { id: "s4", title: "Rain On Your Window", artist: "Placeholder Artist", audio_url: silentAudio, cover_url: img("1499415479124-43c32433a620", 400, 400), order: 4 },
  { id: "s5", title: "The Quiet One", artist: "Placeholder Artist", audio_url: silentAudio, cover_url: img("1493225457124-a3eb161ffa5f", 400, 400), order: 5 },
];

export const timeline: TimelineEvent[] = [
  { id: "t1", date: "The first message", caption: "It started with something small and stupid, and you replied anyway.", photo_url: img("1518199266791-5375a83190b7"), order: 1 },
  { id: "t2", date: "That first walk", caption: "We got lost on purpose. I remember the light more than the streets.", photo_url: img("1502082553048-f009c37129b9"), order: 2 },
  { id: "t3", date: "Our first trip", caption: "You fell asleep on my shoulder and I stopped moving for two hours.", photo_url: img("1500530855697-b586d89ba3ee"), order: 3 },
  { id: "t4", date: "The rainy night", caption: "Wet coats, warm hands, one shared umbrella that didn't really work.", photo_url: img("1519821172144-4f87d85de2a4"), order: 4 },
  { id: "t5", date: "This year, with you", caption: "Every ordinary evening quietly turned into something I want to keep.", photo_url: img("1494774157365-9e04c6720e47"), order: 5 },
];

export const memories: MemoryPhoto[] = [
  { id: "m1", photo_url: img("1519741497674-611481863552"), caption: "Golden hour, borrowed sweater.", order: 1 },
  { id: "m2", photo_url: img("1500043357865-c6b8827edf10"), caption: "You, laughing at nothing.", order: 2 },
  { id: "m3", photo_url: img("1517841905240-472988babdf9", 800, 1000), caption: "The look I never got tired of.", order: 3 },
  { id: "m4", photo_url: img("1494790108377-be9c29b29330"), caption: "First coffee, quiet morning.", order: 4 },
  { id: "m5", photo_url: img("1524504388940-b1c1722653e1", 800, 600), caption: "Somewhere near the water.", order: 5 },
  { id: "m6", photo_url: img("1502823403499-6ccfcf4fb453"), caption: "The one I keep as my wallpaper.", order: 6 },
  { id: "m7", photo_url: img("1521572163474-6864f9cf17ab", 800, 1100), caption: "Every ordinary Tuesday.", order: 7 },
  { id: "m8", photo_url: img("1531123897727-8f129e1688ce"), caption: "You, and the whole rest of the frame.", order: 8 },
];

export const letters: Letter[] = [
  {
    id: "l1",
    title: "Read me first",
    body: "Pragya,\n\nI don't always find the right words when you're in the room. So I put a few here, where I can be brave and quiet at the same time. Everything I want to say starts with: I am so glad it's you.\n\nYours,\nMe",
    unlock_date: "2026-07-01",
  },
  {
    id: "l2",
    title: "The soft one",
    body: "For every small thing you do that you don't think anyone notices — I notice. All of it. The way you hum before coffee, the way you fix your hair when you're thinking. I keep those, quietly.\n\nAlways,\nMe",
    unlock_date: "2026-07-15",
  },
  {
    id: "l3",
    title: "For your birthday",
    body: "Happy birthday, my love.\n\nA whole year of us again, and I would sign up for a hundred more without reading the terms. Whatever this year brings, I'm walking into it holding your hand.\n\nHappy birthday, Pragya. All of me, all of it, all yours.",
    unlock_date: "2026-07-31",
  },
];

export const gameQuestions: GameQuestion[] = [
  {
    id: "g1",
    photo_url: img("1502602898657-3e91760cbb34", 1000, 700),
    correct_location: "That trip we almost missed the train for",
    wrong_options: ["The rooftop in December", "Your parents' garden", "The little café near your place"],
    hidden_note: "You were wearing that jacket I love. I remember thinking, 'don't ever forget this.'",
  },
  {
    id: "g2",
    photo_url: img("1519677100203-a0e668c92439", 1000, 700),
    correct_location: "The rooftop, our anniversary",
    wrong_options: ["Random Tuesday balcony", "That hotel you didn't like", "The airport, obviously"],
    hidden_note: "The lights below looked like a small city built just for us. Maybe they were.",
  },
];
