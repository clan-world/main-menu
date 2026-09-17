// Tiny WebAudio synth for console-style UI feedback. No audio assets shipped.
let ctx = null
let master = null
let ambient = null
let enabled = true

function ensure() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.5
  master.connect(ctx.destination)
  return ctx
}

export function unlock() {
  const c = ensure()
  if (c && c.state === 'suspended') c.resume()
}

export function setEnabled(v) {
  enabled = v
  if (master) master.gain.setTargetAtTime(v ? 0.5 : 0, ctx.currentTime, 0.05)
}
export function isEnabled() {
  return enabled
}

function tone({ freq = 880, to = null, dur = 0.08, type = 'sine', gain = 0.12, delay = 0 }) {
  const c = ensure()
  if (!c || !enabled) return
  const t0 = c.currentTime + delay
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t0)
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g).connect(master)
  o.start(t0)
  o.stop(t0 + dur + 0.02)
}

function noiseBurst({ dur = 0.12, gain = 0.06, freq = 1800, delay = 0 }) {
  const c = ensure()
  if (!c || !enabled) return
  const t0 = c.currentTime + delay
  const len = Math.floor(c.sampleRate * dur)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = c.createBufferSource()
  src.buffer = buf
  const f = c.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.value = freq
  f.Q.value = 0.8
  const g = c.createGain()
  g.gain.value = gain
  src.connect(f).connect(g).connect(master)
  src.start(t0)
}

export const sfx = {
  hover() {
    tone({ freq: 720, to: 980, dur: 0.06, gain: 0.05, type: 'triangle' })
  },
  confirm() {
    tone({ freq: 523, to: 784, dur: 0.12, gain: 0.1, type: 'triangle' })
    tone({ freq: 1046, dur: 0.18, gain: 0.06, delay: 0.06 })
    noiseBurst({ dur: 0.08, gain: 0.03, freq: 3000 })
  },
  back() {
    tone({ freq: 660, to: 330, dur: 0.14, gain: 0.08, type: 'triangle' })
  },
  play() {
    // a short brass-ish fanfare
    tone({ freq: 392, dur: 0.22, gain: 0.12, type: 'sawtooth' })
    tone({ freq: 523, dur: 0.22, gain: 0.1, type: 'sawtooth', delay: 0.16 })
    tone({ freq: 784, dur: 0.5, gain: 0.12, type: 'sawtooth', delay: 0.32 })
    tone({ freq: 196, dur: 0.9, gain: 0.08, type: 'triangle', delay: 0.32 })
    noiseBurst({ dur: 0.5, gain: 0.05, freq: 600, delay: 0.3 })
  },
  boot() {
    tone({ freq: 110, dur: 1.6, gain: 0.12, type: 'triangle' })
    tone({ freq: 220, dur: 1.4, gain: 0.06, type: 'sine', delay: 0.1 })
    tone({ freq: 330, dur: 1.2, gain: 0.05, type: 'sine', delay: 0.25 })
    noiseBurst({ dur: 0.6, gain: 0.04, freq: 400 })
  },
}

/** Low, filtered wind + hum. Cheap enough to leave running. */
export function startAmbient() {
  const c = ensure()
  if (!c || ambient) return
  const len = c.sampleRate * 3
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1
    last = (last + 0.02 * w) / 1.02 // brown-ish noise
    d[i] = last * 3.5
  }
  const src = c.createBufferSource()
  src.buffer = buf
  src.loop = true
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 320
  const lfo = c.createOscillator()
  lfo.frequency.value = 0.07
  const lfoGain = c.createGain()
  lfoGain.gain.value = 180
  lfo.connect(lfoGain).connect(lp.frequency)
  const g = c.createGain()
  g.gain.value = 0.0001
  g.gain.setTargetAtTime(0.16, c.currentTime, 2.5)
  src.connect(lp).connect(g).connect(master)
  const hum = c.createOscillator()
  hum.type = 'sine'
  hum.frequency.value = 55
  const hg = c.createGain()
  hg.gain.value = 0.02
  hum.connect(hg).connect(master)
  src.start()
  lfo.start()
  hum.start()
  ambient = { src, lfo, hum, g, hg }
}

export function stopAmbient() {
  if (!ambient) return
  const { src, lfo, hum, g, hg } = ambient
  g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4)
  hg.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4)
  setTimeout(() => {
    src.stop()
    lfo.stop()
    hum.stop()
  }, 1500)
  ambient = null
}
export function ambientRunning() {
  return !!ambient
}
