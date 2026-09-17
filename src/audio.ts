let ctx: AudioContext | null = null;
let musicGain: GainNode | null = null;
let crackleTimer: number | null = null;

export type AudioFlags = {
  muted: boolean;
  music: boolean;
};

const flags: AudioFlags = { muted: false, music: true };

export function getFlags(): AudioFlags {
  return { ...flags };
}

export async function unlock() {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") await ctx.resume();
  if (flags.music) startMusic();
}

function ac(): AudioContext | null {
  return flags.muted ? null : ctx;
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType,
  gain: number,
  slide = 0,
) {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), c.currentTime + dur);
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g).connect(c.destination);
  o.start();
  o.stop(c.currentTime + dur + 0.02);
}

export function hoverTick() {
  tone(740, 0.05, "triangle", 0.028);
}

export function pressTick() {
  tone(196, 0.1, "square", 0.045, -80);
  tone(98, 0.16, "sine", 0.05);
}

export function confirmTick() {
  tone(392, 0.12, "triangle", 0.05);
  window.setTimeout(() => tone(523, 0.16, "triangle", 0.045), 80);
  window.setTimeout(() => tone(784, 0.22, "sine", 0.04), 160);
}

export function setMuted(next: boolean) {
  flags.muted = next;
  if (musicGain && ctx) {
    musicGain.gain.setTargetAtTime(next || !flags.music ? 0 : 0.045, ctx.currentTime, 0.08);
  }
}

export function setMusic(next: boolean) {
  flags.music = next;
  if (next && ctx && !flags.muted) startMusic();
  else if (musicGain && ctx) {
    musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
  }
}

function startMusic() {
  if (!ctx || musicGain) {
    if (musicGain && ctx && !flags.muted && flags.music) {
      musicGain.gain.setTargetAtTime(0.045, ctx.currentTime, 0.2);
    }
    return;
  }
  const master = ctx.createGain();
  master.gain.value = flags.muted ? 0 : 0.045;
  master.connect(ctx.destination);
  musicGain = master;

  const pad = (freq: number, type: OscillatorType, detune: number) => {
    const o = ctx!.createOscillator();
    const g = ctx!.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    g.gain.value = 0.35;
    o.connect(g).connect(master);
    o.start();
  };
  pad(65.41, "sine", 0);
  pad(98, "triangle", -6);
  pad(130.8, "sine", 4);

  const bufferSize = 2 * ctx.sampleRate;
  const noise = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.6;
  const ng = ctx.createGain();
  ng.gain.value = 0.08;
  src.connect(filter).connect(ng).connect(master);
  src.start();

  const pop = () => {
    if (!ctx || flags.muted || !flags.music) return;
    tone(120 + Math.random() * 80, 0.04, "sawtooth", 0.012);
  };
  crackleTimer = window.setInterval(pop, 420);
}

export function disposeMusic() {
  if (crackleTimer) window.clearInterval(crackleTimer);
  crackleTimer = null;
}
