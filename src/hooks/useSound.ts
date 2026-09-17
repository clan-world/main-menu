import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tiny synthesized console UI sounds (no audio assets to load).
 * - tick: menu move
 * - confirm: select
 * - back: close panel
 * Audio is unlocked on the first user gesture (browser autoplay policy).
 */
export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState<boolean>(() => localStorage.getItem("cw.muted") === "1");

  const ctx = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  };

  useEffect(() => {
    const unlock = () => { try { ctx(); } catch { /* no audio */ } };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => { window.removeEventListener("pointerdown", unlock); window.removeEventListener("keydown", unlock); };
  }, []);

  useEffect(() => { localStorage.setItem("cw.muted", muted ? "1" : "0"); }, [muted]);

  const play = useCallback((kind: "tick" | "confirm" | "back" | "open") => {
    if (muted) return;
    let ac: AudioContext;
    try { ac = ctx(); } catch { return; }
    const t = ac.currentTime;
    const out = ac.createGain();
    out.connect(ac.destination);
    const tone = (freq: number, start: number, dur: number, gain: number, type: OscillatorType = "triangle") => {
      const o = ac.createOscillator(); const g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t + start);
      g.gain.setValueAtTime(0, t + start);
      g.gain.linearRampToValueAtTime(gain, t + start + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + start + dur);
      o.connect(g).connect(out); o.start(t + start); o.stop(t + start + dur + 0.05);
    };
    const thud = (start: number) => {
      // filtered noise burst = wooden/stone knock
      const len = Math.floor(ac.sampleRate * 0.12);
      const buf = ac.createBuffer(1, len, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      const s = ac.createBufferSource(); s.buffer = buf;
      const f = ac.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 900;
      const g = ac.createGain(); g.gain.value = 0.35;
      s.connect(f).connect(g).connect(out); s.start(t + start);
    };
    switch (kind) {
      case "tick": tone(880, 0, 0.06, 0.08, "square"); tone(1320, 0.01, 0.05, 0.03, "sine"); break;
      case "confirm": thud(0); tone(523, 0.02, 0.18, 0.12); tone(784, 0.08, 0.28, 0.1); tone(1046, 0.14, 0.4, 0.06, "sine"); break;
      case "open": thud(0); tone(392, 0.02, 0.25, 0.1); tone(587, 0.1, 0.35, 0.07, "sine"); break;
      case "back": tone(440, 0, 0.12, 0.08); tone(330, 0.07, 0.16, 0.08); break;
    }
  }, [muted]);

  return { play, muted, toggleMuted: () => setMuted((m) => !m) };
}
