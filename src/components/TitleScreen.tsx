import { art } from "../assets";

/** Attract / boot screen: any key, click or tap enters the hub (also unlocks audio). */
export default function TitleScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="title" onPointerDown={onEnter} role="button" tabIndex={0} aria-label="Press any key to enter">
      <div className="title-sigil" aria-hidden="true">
        <img className="title-ring" src={art.runeRing} alt="" draggable={false} />
        <img className="title-crest" src={art.crest} alt="" draggable={false} />
      </div>
      <img className="title-wordmark" src={art.wordmark} alt="Clan World" draggable={false} />
      <p className="title-press">Press any key <span className="title-or">or tap</span> to enter</p>
    </div>
  );
}
