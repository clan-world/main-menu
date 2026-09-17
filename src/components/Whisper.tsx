import { useEffect, useState } from "react";

const LINES = [
  "The gate remembers every clan that knelt before it.",
  "Gold that is believed in grows heavier.",
  "Seven runes were carved. Six were found.",
  "The northern ridge is quiet. Too quiet for autumn.",
  "Tear the wax slowly. Some packs bite back.",
  "A clan is only as loud as its quietest drummer.",
  "Dusk is when the banners speak.",
];

/**
 * Looping "ink whisper": one line at a time, letters bleed in with a stagger,
 * hold, then fade back into the parchment. Pure CSS animation per letter.
 */
export default function Whisper({ className = "" }: { className?: string }) {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const line = LINES[i % LINES.length];

  useEffect(() => {
    const inMs = 40 * line.length + 900;   // stagger + last letter
    const holdMs = 2600;
    const t1 = setTimeout(() => setPhase("out"), inMs + holdMs);
    const t2 = setTimeout(() => { setPhase("in"); setI((n) => n + 1); }, inMs + holdMs + 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [i, line.length]);

  return (
    <p className={`whisper ${phase} ${className}`} aria-live="polite" key={i}>
      <svg className="whisper-rune" viewBox="0 0 16 18" aria-hidden="true"><path d="M4 1v16M4 1h5l3 4-3 4H4M9 9l4 8" /></svg>
      {line.split("").map((ch, k) => (
        <span key={k} className="whisper-ch" style={{ animationDelay: `${k * 40}ms` }}>{ch === " " ? " " : ch}</span>
      ))}
    </p>
  );
}
