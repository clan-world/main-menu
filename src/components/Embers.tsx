import { useEffect, useRef } from "react";

/** Canvas ember/ash particles drifting upward. Sized to its parent; DPR aware. */
export default function Embers({ density = 40, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    type P = { x: number; y: number; r: number; vy: number; vx: number; life: number; max: number; hue: number };
    let ps: P[] = [];
    const spawn = (): P => ({
      x: Math.random() * w, y: h + 10 + Math.random() * 40, r: 0.8 + Math.random() * 2.2,
      vy: 0.25 + Math.random() * 0.7, vx: (Math.random() - 0.5) * 0.25, life: 0, max: 400 + Math.random() * 500,
      hue: 25 + Math.random() * 25,
    });
    const resize = () => {
      const r = c.parentElement!.getBoundingClientRect();
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      c.width = w * dpr; c.height = h * dpr; c.style.width = w + "px"; c.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(density * (w * h) / (900 * 600));
      ps = Array.from({ length: Math.max(8, n) }, () => { const p = spawn(); p.y = Math.random() * h; p.life = Math.random() * p.max; return p; });
    };
    const ro = new ResizeObserver(resize); ro.observe(c.parentElement!); resize();
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(2, (now - last) / 16.7); last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.life += dt; p.y -= p.vy * dt; p.x += (p.vx + Math.sin((p.life + i * 13) / 40) * 0.18) * dt;
        const k = p.life / p.max; const a = k < 0.15 ? k / 0.15 : k > 0.8 ? (1 - k) / 0.2 : 1;
        if (k >= 1 || p.y < -10) { ps[i] = spawn(); continue; }
        const flick = 0.75 + 0.25 * Math.sin(p.life / 3 + i);
        ctx.beginPath(); ctx.fillStyle = `hsla(${p.hue}, 100%, 62%, ${0.55 * a * flick})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 55%, ${0.8 * a})`; ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;
      if (!reduce) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [density]);
  return <canvas ref={ref} className={`embers ${className}`} aria-hidden="true" />;
}
