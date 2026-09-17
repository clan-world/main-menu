import { useCallback, useEffect, useMemo, useState } from "react";
import { artVars } from "./assets";
import { MENU } from "./menu";
import Hud from "./components/Hud";
import Hero from "./components/Hero";
import MenuList from "./components/MenuList";
import Panel from "./components/Panel";
import PromptBar from "./components/PromptBar";
import TitleScreen from "./components/TitleScreen";
import { useSound } from "./hooks/useSound";
import { useGamepad } from "./hooks/useGamepad";
import { useMedia } from "./hooks/useMedia";

type Phase = "title" | "menu";

export default function App() {
  // ?skipintro jumps past the attract screen; ?panel=<id> opens a route stub (handy for review links).
  const params = new URLSearchParams(location.search);
  const initialPanel = MENU.findIndex((m) => m.id === params.get("panel"));
  const [phase, setPhase] = useState<Phase>(params.has("skipintro") || initialPanel >= 0 ? "menu" : "title");
  const [selected, setSelected] = useState(Math.max(0, initialPanel));
  const [open, setOpen] = useState<number | null>(initialPanel >= 0 ? initialPanel : null);
  const { play, muted, toggleMuted } = useSound();
  const compact = useMedia("(max-width: 760px)");
  const touch = useMedia("(hover: none) and (pointer: coarse)");

  const enter = useCallback(() => { if (phase === "title") { setPhase("menu"); play("open"); } }, [phase, play]);

  const move = useCallback((d: 1 | -1) => {
    setSelected((s) => { const n = (s + d + MENU.length) % MENU.length; return n; });
    play("tick");
  }, [play]);

  const activate = useCallback((i: number) => { setOpen(i); play("confirm"); }, [play]);
  const close = useCallback(() => { setOpen(null); play("back"); }, [play]);

  const padConnected = useGamepad((a) => {
    if (phase === "title") { enter(); return; }
    if (open !== null) { if (a === "back" || a === "confirm") close(); return; }
    if (a === "up") move(-1); else if (a === "down") move(1); else if (a === "confirm") activate(selected);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (phase === "title") { e.preventDefault(); enter(); return; }
      if (open !== null) { if (e.key === "Escape" || e.key === "Backspace") { e.preventDefault(); close(); } return; }
      switch (e.key) {
        case "ArrowDown": case "s": case "S": case "j": e.preventDefault(); move(1); break;
        case "ArrowUp": case "w": case "W": case "k": e.preventDefault(); move(-1); break;
        case "Enter": case " ": e.preventDefault(); activate(selected); break;
        case "Tab": break; // native focus order still works
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, open, selected, move, activate, close, enter]);

  // Auto-enter after a while so the attract screen never traps a reviewer.
  useEffect(() => { if (phase !== "title") return; const t = setTimeout(enter, 9000); return () => clearTimeout(t); }, [phase, enter]);

  const style = useMemo(() => artVars as React.CSSProperties, []);
  const hoverSelects = !touch;

  return (
    <div className={`console ${phase === "menu" ? "is-live" : ""} ${compact ? "is-compact" : ""}`} style={style}>
      <div className="parchment" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <span className="corner c-tl" aria-hidden="true" /><span className="corner c-tr" aria-hidden="true" />
      <span className="corner c-bl" aria-hidden="true" /><span className="corner c-br" aria-hidden="true" />

      {phase === "title" ? (
        <TitleScreen onEnter={enter} />
      ) : (
        <>
          <Hud muted={muted} onToggleMute={toggleMuted} padConnected={padConnected} />
          <main className="stage">
            <Hero compact={compact} />
            <MenuList
              items={MENU}
              selected={selected}
              onSelect={(i) => { if (i !== selected) { setSelected(i); play("tick"); } }}
              onActivate={activate}
              hover={hoverSelects}
            />
          </main>
          <PromptBar pad={padConnected} touch={touch} inPanel={open !== null} />
          {open !== null && <Panel item={MENU[open]} onClose={close} />}
        </>
      )}
    </div>
  );
}
