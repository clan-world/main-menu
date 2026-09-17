import { useEffect, useRef } from "react";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
};

export default function Embers({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let sparks: Spark[] = [];
    let raf = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawn = (w: number, h: number) => {
      sparks.push({
        x: w * (0.42 + Math.random() * 0.22),
        y: h * (0.62 + Math.random() * 0.18),
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.35 - Math.random() * 0.7,
        life: 0,
        max: 90 + Math.random() * 80,
        size: 1 + Math.random() * 2.2,
      });
    };

    const tick = () => {
      if (!running) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      if (sparks.length < 28) spawn(w, h);
      sparks = sparks.filter((s) => s.life < s.max);
      for (const s of sparks) {
        s.life += 1;
        s.x += s.vx;
        s.y += s.vy;
        s.vy *= 0.995;
        const t = s.life / s.max;
        ctx.globalAlpha = (1 - t) * 0.85;
        ctx.fillStyle = t < 0.4 ? "#ffe7a0" : t < 0.7 ? "#e28a32" : "#7a2a12";
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduced]);

  if (reduced) return null;
  return <canvas ref={ref} className="embers" aria-hidden="true" />;
}
