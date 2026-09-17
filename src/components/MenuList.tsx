import { useEffect, useRef } from "react";
import { icons } from "../assets";
import type { MenuItem } from "../menu";

type Props = {
  items: MenuItem[];
  selected: number;
  onSelect: (i: number) => void;
  onActivate: (i: number) => void;
  hover: boolean;
};

/** Vertical stack of textured plate buttons with a console-style selector. */
export default function MenuList({ items, selected, onSelect, onActivate, hover }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const el = refs.current[selected];
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <nav className="menu" aria-label="Main menu">
      <ul className="menu-list" role="menu">
        {items.map((it, i) => {
          const isSel = i === selected;
          return (
            <li key={it.id} className="menu-item" style={{ "--i": i } as React.CSSProperties}>
              <button
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                role="menuitem"
                className={`plate ${it.primary ? "plate-primary" : "plate-secondary"} ${isSel ? "is-selected" : ""}`}
                aria-current={isSel ? "true" : undefined}
                onPointerEnter={() => { if (hover) onSelect(i); }}
                onFocus={() => onSelect(i)}
                onClick={() => { onSelect(i); onActivate(i); }}
              >
                <span className="plate-selector" aria-hidden="true">
                  <span className="sel-l">❮</span><span className="sel-r">❯</span>
                </span>
                <span className="plate-icon"><img src={icons[it.icon]} alt="" draggable={false} /></span>
                <span className="plate-text">
                  <span className="plate-label">{it.label}</span>
                  <span className="plate-caption">{it.caption}</span>
                </span>
                {it.badge && <span className="plate-badge">{it.badge}</span>}
                {it.primary && <span className="plate-cta" aria-hidden="true">▶</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
