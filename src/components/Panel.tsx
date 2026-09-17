import { useEffect, useState } from "react";
import { art, icons } from "../assets";
import type { MenuItem } from "../menu";

/** Placeholder route panel: a parchment scroll that unfurls over the hub. */
export default function Panel({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  const boot = item.id === "play";
  useEffect(() => {
    if (!boot) return;
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => { const k = Math.min(1, (t - t0) / 3200); setProgress(k); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [boot]);

  return (
    <div className="panel-backdrop" onClick={onClose} role="presentation">
      <section className="panel" role="dialog" aria-modal="true" aria-labelledby="panel-title" onClick={(e) => e.stopPropagation()}>
        <img className="panel-seal" src={art.waxSeal} alt="" draggable={false} />
        <header className="panel-head">
          <img className="panel-icon" src={icons[item.icon]} alt="" draggable={false} />
          <div>
            <h2 id="panel-title" className="panel-title">{item.label}</h2>
            <p className="panel-caption">{item.caption}</p>
          </div>
        </header>
        <p className="panel-body">{item.blurb}</p>
        {boot ? (
          <div className="boot">
            <div className="boot-bar" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
              <span style={{ width: `${progress * 100}%` }} />
            </div>
            <p className="boot-text">{progress < 1 ? `Binding runes… ${Math.round(progress * 100)}%` : "Prototype stub: the world would load here."}</p>
          </div>
        ) : (
          <p className="panel-stub">Prototype stub. This route will host the real {item.label.toLowerCase()} screen.</p>
        )}
        <footer className="panel-foot">
          <button type="button" className="plate plate-secondary plate-small" onClick={onClose} autoFocus>
            <span className="plate-text"><span className="plate-label">Back</span></span>
          </button>
          <span className="panel-hint"><kbd>Esc</kbd> / <kbd>B</kbd> to return</span>
        </footer>
      </section>
    </div>
  );
}
