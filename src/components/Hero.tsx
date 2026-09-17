import { useEffect, useState } from "react";
import { art } from "../assets";
import Embers from "./Embers";
import Whisper from "./Whisper";

function useCounter(target: number, ms = 1600) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => { const k = Math.min(1, (t - t0) / ms); setV(Math.round(target * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

/** The "living" right side: painted scene with slow drift, breathing gate glow,
 *  rotating rune ring behind the crest, embers, live counters and the whisper loop. */
export default function Hero({ compact = false }: { compact?: boolean }) {
  const clans = useCounter(1284);
  const believers = useCounter(88412, 2200);
  return (
    <section className={`hero ${compact ? "hero-compact" : ""}`} aria-label="Clan World">
      <div className="hero-scene">
        <img className="hero-img" src={art.heroScene} alt="" draggable={false} />
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-haze" aria-hidden="true" />
        <Embers density={compact ? 24 : 46} />
      </div>
      <div className="hero-top">
        <img className="hero-wordmark" src={art.wordmark} alt="Clan World" draggable={false} />
        <div className="hero-season"><span className="live-dot" />Season I · The Lit Gate</div>
      </div>
      <div className="hero-sigil" aria-hidden="true">
        <img className="hero-ring" src={art.runeRing} alt="" draggable={false} />
        <img className="hero-crest" src={art.crest} alt="" draggable={false} />
      </div>
      <div className="hero-stats" aria-label="Live world stats">
        <div className="stat"><b>{clans.toLocaleString()}</b><span>clans online</span></div>
        <div className="stat-sep" />
        <div className="stat"><b>{believers.toLocaleString()}</b><span>gold believers</span></div>
        <div className="stat-sep" />
        <div className="stat"><b>3</b><span>raids at dusk</span></div>
      </div>
      <Whisper className="hero-whisper" />
    </section>
  );
}
