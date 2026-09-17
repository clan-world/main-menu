import type { MenuItem } from "../data/menu";
import Embers from "./Embers";
import WhisperInk from "./WhisperInk";

type Props = {
  item: MenuItem;
  reduced: boolean;
  music: boolean;
  sfx: boolean;
  cursor: boolean;
  entering: boolean;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onToggleMotion: () => void;
  onToggleCursor: () => void;
  onEnter: () => void;
};

export default function LivingStage({
  item,
  reduced,
  music,
  sfx,
  cursor,
  entering,
  onToggleMusic,
  onToggleSfx,
  onToggleMotion,
  onToggleCursor,
  onEnter,
}: Props) {
  return (
    <section className={`stage ${entering ? "is-entering" : ""}`} aria-live="polite">
      <div className={`stage-world ${reduced ? "is-still" : ""}`}>
        <img className="stage-hero" src="/art/hero-camp.jpg" alt="" />
        {reduced ? null : (
          <video
            className="stage-hero stage-hero-clip"
            poster="/art/hero-camp.jpg"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          >
            <source src="/art/hero-camp.mp4" type="video/mp4" />
          </video>
        )}
        <div className="stage-fire" aria-hidden="true" />
        <div className="stage-vignette" aria-hidden="true" />
        <Embers reduced={reduced} />
      </div>
      <div className="stage-frame" aria-hidden="true" />

      <div className="stage-copy">
        {item.kicker ? <p className="stage-kicker">{item.kicker}</p> : null}
        <h2 className="stage-title">{item.title}</h2>
        <p className="stage-body">{item.body}</p>

        {item.id === "settings" ? (
          <div className="settings">
            <Toggle label="Hearth drone" on={music} onToggle={onToggleMusic} />
            <Toggle label="Menu ticks" on={sfx} onToggle={onToggleSfx} />
            <Toggle label="Living motion" on={!reduced} onToggle={onToggleMotion} />
            <Toggle label="Custom cursor" on={cursor} onToggle={onToggleCursor} />
          </div>
        ) : null}

        {item.id === "minigames" ? (
          <ul className="mini-list">
            <li>Hearth dice</li>
            <li>Banner toss</li>
            <li>Wagon race</li>
          </ul>
        ) : null}

        {item.cta ? (
          <button type="button" className="cta" data-hoverable onClick={onEnter}>
            <span className="cta-plate" aria-hidden="true" />
            <span className="cta-label">{item.cta}</span>
          </button>
        ) : null}
      </div>

      <div className="stage-whisper">
        <WhisperInk reduced={reduced} />
      </div>
    </section>
  );
}

function Toggle({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={`toggle ${on ? "is-on" : ""}`}
      data-hoverable
      onClick={onToggle}
      aria-pressed={on}
    >
      <span className="toggle-pip" />
      <span>{label}</span>
      <span className="toggle-state">{on ? "On" : "Off"}</span>
    </button>
  );
}
