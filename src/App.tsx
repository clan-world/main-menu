import { useCallback, useEffect, useMemo, useState } from "react";
import GameCursor from "./components/GameCursor";
import LivingStage from "./components/LivingStage";
import MenuButton from "./components/MenuButton";
import { MENU, type MenuId } from "./data/menu";
import {
  confirmTick,
  hoverTick,
  pressTick,
  setMusic,
  setMuted,
  unlock,
} from "./audio";
import "./App.css";

const prefersCoarse = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function App() {
  const [selected, setSelected] = useState<MenuId>("play");
  const [booting, setBooting] = useState(true);
  const [entering, setEntering] = useState(false);
  const [sfx, setSfx] = useState(true);
  const [music, setMusicOn] = useState(true);
  const [reduced, setReduced] = useState(prefersReduced);
  const [cursorOn, setCursorOn] = useState(() => !prefersCoarse());
  const [armed, setArmed] = useState(false);

  const item = useMemo(
    () => MENU.find((m) => m.id === selected) ?? MENU[0],
    [selected],
  );
  const index = MENU.findIndex((m) => m.id === selected);

  const arm = useCallback(() => {
    if (armed) return;
    setArmed(true);
    void unlock();
  }, [armed]);

  const select = useCallback(
    (id: MenuId, playHover = true) => {
      setSelected((prev) => {
        if (prev !== id && playHover && sfx) hoverTick();
        return id;
      });
    },
    [sfx],
  );

  const confirm = useCallback(
    (id: MenuId) => {
      arm();
      select(id, false);
      if (sfx) pressTick();
      if (id === "play") {
        if (sfx) confirmTick();
        setEntering(true);
        window.setTimeout(() => setEntering(false), 1600);
      }
    },
    [arm, select, sfx],
  );

  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 1400);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        const next = MENU[(index + 1) % MENU.length];
        select(next.id);
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        const next = MENU[(index - 1 + MENU.length) % MENU.length];
        select(next.id);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        confirm(selected);
      } else if (e.key >= "1" && e.key <= String(MENU.length)) {
        const next = MENU[Number(e.key) - 1];
        if (next) confirm(next.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, selected, select, confirm]);

  useEffect(() => {
    const onFirst = () => arm();
    window.addEventListener("pointerdown", onFirst, { once: true });
    return () => window.removeEventListener("pointerdown", onFirst);
  }, [arm]);

  const toggleSfx = () => {
    const next = !sfx;
    setSfx(next);
    setMuted(!next);
  };
  const toggleMusic = () => {
    const next = !music;
    setMusicOn(next);
    setMusic(next);
  };

  return (
    <div className="hub" onPointerDown={arm}>
      <div className="parchment" aria-hidden="true" />
      <div className="parchment-runes" aria-hidden="true" />

      <div className="rail">
        <img className="wordmark" src="/art/wordmark.png" alt="Clan World" />
        <nav className="menu" aria-label="Main menu">
          {MENU.map((entry) => (
            <MenuButton
              key={entry.id}
              item={entry}
              selected={entry.id === selected}
              onSelect={() => select(entry.id)}
              onConfirm={() => confirm(entry.id)}
            />
          ))}
        </nav>
        <div className="dock">
          <span className="build">v0.1 hearth</span>
          <span className="hint">
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            select
            <kbd>⏎</kbd>
            confirm
          </span>
          <button
            type="button"
            className={`mute ${sfx ? "is-on" : ""}`}
            data-hoverable
            onClick={toggleSfx}
            aria-label={sfx ? "Mute ticks" : "Unmute ticks"}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              {sfx ? (
                <path
                  fill="currentColor"
                  d="M3 9h4l5-4v14l-5-4H3V9zm12.5 3a4.5 4.5 0 0 0-2.2-3.9l1.2-1.6A6.5 6.5 0 0 1 18.5 12a6.5 6.5 0 0 1-3.99 6l-1.2-1.6A4.5 4.5 0 0 0 15.5 12z"
                />
              ) : (
                <path
                  fill="currentColor"
                  d="M3 9h4l5-4v14l-5-4H3V9zm11.2 1.2 1.4-1.4 2.1 2.1 2.1-2.1 1.4 1.4-2.1 2.1 2.1 2.1-1.4 1.4-2.1-2.1-2.1 2.1-1.4-1.4 2.1-2.1-2.1-2.1z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <LivingStage
        item={item}
        reduced={reduced}
        music={music}
        sfx={sfx}
        cursor={cursorOn}
        entering={entering}
        onToggleMusic={toggleMusic}
        onToggleSfx={toggleSfx}
        onToggleMotion={() => setReduced((v) => !v)}
        onToggleCursor={() => setCursorOn((v) => !v)}
        onEnter={() => confirm("play")}
      />

      {booting ? (
        <div className="boot" aria-hidden="true">
          <img src="/art/wordmark.png" alt="" />
          <p>The hearth catches…</p>
        </div>
      ) : null}

      {entering ? (
        <div className="enter-veil" aria-live="assertive">
          <p>Crossing the hearth</p>
        </div>
      ) : null}

      <GameCursor enabled={cursorOn} />
    </div>
  );
}
