import { useState } from "react";
import { Music, VolumeX } from "lucide-react";

export function MusicToggle() {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className="fixed top-4 right-4 z-40 w-11 h-11 rounded-full grid place-items-center ember-outline backdrop-blur md:right-6 md:top-6"
      aria-label={on ? "Pause background music" : "Play background music"}
      title={on ? "music on" : "music off"}
    >
      {on ? <Music className="w-4 h-4 animate-heartbeat" /> : <VolumeX className="w-4 h-4" />}
    </button>
  );
}
