import { useEffect, useState } from 'react'
import { HeroScene } from '../scene/HeroScene.jsx'
import { Corners, Rule } from './Ornament.jsx'

const TICKER = [
  { k: 'Warriors awake', v: () => 1180 + Math.floor(Math.random() * 90) },
  { k: 'Clans mustered', v: () => 212 + Math.floor(Math.random() * 6) },
  { k: 'Packs ripped today', v: () => 3400 + Math.floor(Math.random() * 300) },
]

function pad(n) {
  return String(n).padStart(2, '0')
}

/** The "living" right side: canvas painting + a few animated status plates. */
export function HeroPanel({ reduced, paused, item, onPlay }) {
  const [left, setLeft] = useState(2 * 3600 + 14 * 60 + 9)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setLeft((s) => (s > 0 ? s - 1 : 6 * 3600))
      setTick((v) => v + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])
  const hh = Math.floor(left / 3600)
  const mm = Math.floor((left % 3600) / 60)
  const ss = left % 60
  const row = TICKER[Math.floor(tick / 4) % TICKER.length]

  return (
    <section className="hero" aria-label="The realm">
      <div className="hero-frame">
        <Corners />
        <HeroScene reduced={reduced} paused={paused} />
        <div className="hero-overlay">
          <div className="plate plate-top">
            <span className="plate-kicker">Season III</span>
            <span className="plate-title">The Ashen Tide</span>
            <Rule />
          </div>
          <div className="plate plate-live">
            <span className="live-dot" />
            <span className="plate-k">{row.k}</span>
            <span className="plate-v" key={row.k}>
              {row.v().toLocaleString()}
            </span>
          </div>
          <div className="plate plate-countdown">
            <span className="plate-k">Gold Believers · ends in</span>
            <span className="plate-v mono">
              {pad(hh)}:{pad(mm)}:{pad(ss)}
            </span>
          </div>
          <div className="hero-caption" key={item?.id}>
            <span className="caption-label">{item?.label}</span>
            <span className="caption-blurb">{item?.blurb}</span>
          </div>
          <button type="button" className="hero-play" onClick={onPlay} aria-label="Play now">
            <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
              <circle cx="32" cy="32" r="29" fill="rgba(20,12,6,.55)" stroke="#e2b04a" strokeWidth="3" />
              <circle cx="32" cy="32" r="24" fill="none" stroke="#f5d98a" strokeWidth="1" opacity=".7" />
              <path d="M26 20 L44 32 L26 44 Z" fill="#f5d98a" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
