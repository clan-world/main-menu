import { useEffect, useRef } from "react";

type Props = {
  enabled: boolean;
};

export default function GameCursor({ enabled }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const mode = useRef<"arrow" | "pointer">("arrow");

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    document.documentElement.classList.add("hide-native-cursor");

    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
      el.classList.add("is-live");
      const t = e.target as HTMLElement | null;
      const next = t?.closest("[data-hoverable]") ? "pointer" : "arrow";
      if (next !== mode.current) {
        mode.current = next;
        el.dataset.mode = next;
      }
    };
    const onDown = () => el.classList.add("is-click");
    const onUp = () => el.classList.remove("is-click");

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    let raf = 0;
    const tick = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.38;
      p.y += (p.ty - p.y) * 0.38;
      el.style.transform = `translate(${p.x}px, ${p.y}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("hide-native-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} className="game-cursor" data-mode="arrow" aria-hidden="true">
      <span className="game-cursor-sprite">
        <img className="game-cursor-arrow" src="/cursors/arrow.png" alt="" />
        <img className="game-cursor-pointer" src="/cursors/pointer.png" alt="" />
      </span>
    </div>
  );
}
