// Mock data. Swap with Supabase later; keep shapes stable.

const silentAudio =
  "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQxAADB8AhSmxhIIEVCSiJrDCQBTcu3UrAIwUdkRgQbFAZC1CQEwTJ9mjRvBA4UOLD8nKVOWfh+UlK3z/177OXrfOdKl7pyn3Xf//WreyTRUoAWgBgkOAGbZHBgG1OF6zM82DWbZaUmMBptgQhGjsyYqc9ae9XFz84FfHks148pnfPHvHvHu/8fPvvvvvvzz9frHqf9v6zTWNvvvvvvvvv7vvvvv//7v/vv//7v//7v//7v//7v//7v//7";

export type DailyContent = { day: number; date: string; message: string; voice_note_url: string };
export type Song = { id: string; title: string; artist: string; audio_url: string; cover_url: string; order: number; why: string };
export type TimelineEvent = { id: string; date: string; caption: string; photo_url: string; order: number };
export type MemoryPhoto = { id: string; photo_url: string; caption: string; order: number };
export type Letter = { id: string; title: string; body: string; image_url?: string; unlock_date: string };
export type GameQuestion = { id: string; photo_url: string; correct_location: string; wrong_options: string[]; hidden_note: string };

const img = (seed: string, w = 800, h = 800) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;

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
  { id: "s1", title: "Aaoge Jab Tum", artist: "Rashid Khan", audio_url: "/audio/aaoge-jab-tum.mp3", cover_url: "/photos/photo_3.jpg", order: 1, why: "Because every time we're apart, I still wait for your message." },
  { id: "s2", title: "Piyu Bole", artist: "Shreya Ghoshal, Sonu Nigam", audio_url: "/audio/piyu-bole.mp3", cover_url: "/photos/photo_1.jpg", order: 2, why: "Because talking to you feels like home." },
  { id: "s3", title: "Pal Pal Dil Ke Paas", artist: "Kishore Kumar", audio_url: "/audio/pal-pal-dil-ke-paas.mp3", cover_url: "/photos/photo_2.jpg", order: 3, why: "Because distance never changed how close I feel to you." },
  { id: "s4", title: "Tere Bina", artist: "A.R. Rahman", audio_url: "/audio/tere-bina.mp3", cover_url: "/photos/photo_4.jpg", order: 4, why: "Because every drive is better with you singing this." },
  { id: "s5", title: "Tere Naina", artist: "Shafqat Amanat Ali", audio_url: "/audio/tere-naina.mp3", cover_url: "/photos/photo_5.jpg", order: 5, why: "Because your eyes say everything." },
];

export const timeline: TimelineEvent[] = [
  { id: "t1", date: "First Meeting (2018)", caption: "The day we first met.\n\nWho knew what it would turn into.", photo_url: "/audio/now1.jpeg", order: 1 },
  { id: "t2", date: "Study Friends (2019)", caption: "Bonding over books, assignments, and everything in between.", photo_url: "/audio/now2.jpeg", order: 2 },
  { id: "t3", date: "Misunderstanding Phase (2020)", caption: "A little bump in the road.\n\nEven the sun gets covered by clouds sometimes.", photo_url: "/audio/now3.jpeg", order: 3 },
  { id: "t4", date: "Birthday Message (2021)", caption: "A special message that changed everything.", photo_url: "/audio/now4.jpeg", order: 4 },
  { id: "t5", date: "Friends Again (2022)", caption: "Reconnecting and finding our way back to each other.", photo_url: "/audio/now5.jpeg", order: 5 },
  { id: "t6", date: "Best Friends (2024)", caption: "Through thick and thin, always by each other's side.", photo_url: "/audio/now6.jpeg", order: 6 },
  { id: "t7", date: "Today (2026)", caption: "And here we are, celebrating you.\n\nMy world.", photo_url: "/audio/now7.jpeg", order: 7 },
];

export const memories: MemoryPhoto[] = [
  { id: "m1", photo_url: "/photos/photo_11.jpg", caption: "The girl who has no idea how much she's loved.", order: 1 },
  { id: "m2", photo_url: "/photos/photo_12.jpg", caption: "Probably thinking about Virat Kohli.", order: 2 },
  { id: "m3", photo_url: "/photos/photo_13.jpg", caption: "The reason my screen time is so high.", order: 3 },
  { id: "m4", photo_url: "/photos/photo_14.jpg", caption: "One of my favourite smiles.", order: 4 },
  { id: "m5", photo_url: "/photos/photo_15.jpg", caption: "The girl who turned ordinary days into memories.", order: 5 },
  { id: "m6", photo_url: "/photos/photo_16.jpg", caption: "My safe place.", order: 6 },
  { id: "m7", photo_url: "/photos/photo_17.jpg", caption: "My best friend.", order: 7 },
  { id: "m8", photo_url: "/photos/photo_18.jpg", caption: "Birthday Girl ❤️", order: 8 },
];

export const letters: Letter[] = [
  {
    id: "l1",
    title: "Things I Hope You Never Forget",
    body: "",
    image_url: "/audio/Heart_1.jpeg",
    unlock_date: "2026-07-01",
  },
  {
    id: "l2",
    title: "The Version of You I See",
    body: "",
    image_url: "/audio/Heart_2.jpeg",
    unlock_date: "2026-07-15",
  },
  {
    id: "l3",
    title: "For The Girl Turning 20",
    body: "",
    image_url: "/audio/Heart_3.jpeg",
    unlock_date: "2026-07-31",
  },
  {
    id: "l4",
    title: "P.S.",
    body: "",
    image_url: "/audio/Heart_4.jpeg",
    unlock_date: "2026-07-31",
  },
];

export const allPhotos: string[] = Array.from({ length: 50 }, (_, i) => `/photos/photo_${i + 1}.jpg`);

export const memoryMatchPairs = [
  { id: "p1", photo_url: "/photos/photo_20.jpg", message: "The smile that fixes bad days." },
  { id: "p2", photo_url: "/photos/photo_22.jpg", message: "One of my favourite memories." },
  { id: "p3", photo_url: "/photos/photo_24.jpg", message: "Proof that good people still exist." },
  { id: "p4", photo_url: "/photos/photo_26.jpg", message: "A moment worth remembering." },
];