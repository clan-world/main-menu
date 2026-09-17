import { Icon } from './icons.jsx'

export function TopBar({ sound, onToggleSound, onFullscreen }) {
  return (
    <header className="topbar">
      <div className="crest" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="34" height="34">
          <path d="M16 3 L28 8 V17 C28 24 22 28 16 30 C10 28 4 24 4 17 V8 Z" fill="#1a120a" stroke="#e2b04a" strokeWidth="2" />
          <path d="M16 8 V25 M10 13 L22 19 M22 13 L10 19" stroke="#f5d98a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="wordmark">
        <span className="wm-main">Clan World</span>
        <span className="wm-sub">Main hall</span>
      </div>
      <div className="topbar-spacer" />
      <div className="player-plate" aria-label="Player">
        <span className="pp-avatar" aria-hidden="true" />
        <span className="pp-name">Wanderer</span>
        <span className="pp-stat">
          <i className="coin" aria-hidden="true" /> 1,250
        </span>
      </div>
      <button type="button" className="chrome-btn" onClick={onToggleSound} aria-label={sound ? 'Mute' : 'Unmute'} aria-pressed={sound}>
        <Icon name="speaker" muted={!sound} />
      </button>
      <button type="button" className="chrome-btn" onClick={onFullscreen} aria-label="Fullscreen">
        <Icon name="expand" />
      </button>
    </header>
  )
}

export function HintBar({ inputMode }) {
  const pad = inputMode === 'gamepad'
  return (
    <footer className="hintbar" aria-hidden="true">
      <span className="hint">
        <span className={`key ${pad ? 'pad a' : ''}`}>{pad ? 'A' : '↵'}</span> Select
      </span>
      <span className="hint">
        <span className={`key ${pad ? 'pad b' : ''}`}>{pad ? 'B' : 'Esc'}</span> Back
      </span>
      <span className="hint">
        <span className="key">{pad ? '⇕' : '↑↓'}</span> Navigate
      </span>
      <span className="hint-spacer" />
      <span className="hint version">v0.1 · prototype</span>
    </footer>
  )
}
