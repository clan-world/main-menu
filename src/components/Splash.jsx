import { RUNES, runePath } from '../lib/runes.js'

/** Console boot screen. Any key / tap enters and unlocks audio. */
export function Splash({ onEnter, leaving }) {
  return (
    <div className={`splash ${leaving ? 'leaving' : ''}`} onClick={onEnter} role="button" tabIndex={0} aria-label="Press any key to enter">
      <div className="splash-ring" aria-hidden="true">
        <svg viewBox="0 0 200 200" width="260" height="260">
          <circle cx="100" cy="100" r="92" fill="none" stroke="#c8962e" strokeWidth="1.2" opacity=".7" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="#e2b04a" strokeWidth="2" />
          {Array.from({ length: 16 }, (_, i) => (
            <path
              key={i}
              d={runePath(RUNES[(i * 3) % RUNES.length], 12)}
              transform={`rotate(${(i / 16) * 360} 100 100) translate(94 12)`}
              stroke="#f5d98a"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </svg>
      </div>
      <img className="splash-crest" src="/art/crest.webp" alt="" draggable={false} />
      <h1 className="logo">
        <span className="logo-line">Clan</span>
        <span className="logo-line">World</span>
      </h1>
      <p className="press">
        <span className="press-key">Press any key</span> · <span className="press-touch">Tap</span> to enter
      </p>
    </div>
  )
}
