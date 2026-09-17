import { useEffect, useRef, useState } from "react";

export type PadAction = "up" | "down" | "confirm" | "back";

/** Polls the Gamepad API and emits discrete, debounced actions (d-pad / left stick / A / B). */
export function useGamepad(onAction: (a: PadAction) => void) {
  const [connected, setConnected] = useState(false);
  const cb = useRef(onAction);
  cb.current = onAction;

  useEffect(() => {
    let raf = 0;
    const held: Record<string, boolean> = {};
    let repeatAt = 0;
    const fire = (a: PadAction, key: string, now: number) => {
      if (!held[key]) { held[key] = true; cb.current(a); repeatAt = now + 400; }
      else if ((a === "up" || a === "down") && now > repeatAt) { cb.current(a); repeatAt = now + 140; }
    };
    const loop = (now: number) => {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      const pad = Array.from(pads).find((p) => p && p.connected);
      setConnected(!!pad);
      if (pad) {
        const b = (i: number) => !!pad.buttons[i]?.pressed;
        const ay = pad.axes[1] ?? 0;
        const up = b(12) || ay < -0.5, down = b(13) || ay > 0.5;
        if (up) fire("up", "up", now); else held.up = false;
        if (down) fire("down", "down", now); else held.down = false;
        if (b(0)) fire("confirm", "a", now); else held.a = false;
        if (b(1)) fire("back", "b", now); else held.b = false;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return connected;
}
