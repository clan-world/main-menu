import { art, icons } from "../assets";

type Props = { muted: boolean; onToggleMute: () => void; padConnected: boolean };

/** Top console bar: crest, world name, player tag, gold, sound toggle. */
export default function Hud({ muted, onToggleMute, padConnected }: Props) {
  return (
    <header className="hud">
      <div className="hud-left">
        <img className="hud-crest" src={art.crest} alt="" draggable={false} />
        <div className="hud-title">
          <span className="hud-name">Clan World</span>
          <span className="hud-sub">Main menu</span>
        </div>
      </div>
      <div className="hud-right">
        <div className="hud-pill hud-player">
          <span className="hud-avatar" aria-hidden="true">W</span>
          <span className="hud-player-name">Wanderer</span>
          <span className="hud-player-clan">No clan</span>
        </div>
        <div className="hud-pill hud-gold" title="Gold">
          <img src={icons.gold} alt="" draggable={false} />
          <span>1,250</span>
        </div>
        <button type="button" className={`hud-btn ${padConnected ? "is-on" : ""}`} title={padConnected ? "Controller connected" : "No controller"} aria-label="Controller status">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8h10a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4h-1l-2-2h-4l-2 2H7a4 4 0 0 1-4-4v-2a4 4 0 0 1 4-4z" /><path d="M8 11v4M6 13h4M16 12h.01M18 14h.01" /></svg>
        </button>
        <button type="button" className="hud-btn" onClick={onToggleMute} aria-pressed={!muted} aria-label={muted ? "Unmute UI sounds" : "Mute UI sounds"}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" />{muted ? <path d="M17 9l4 6M21 9l-4 6" /> : <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />}</svg>
        </button>
      </div>
    </header>
  );
}
