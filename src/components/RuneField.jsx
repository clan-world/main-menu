import { useEffect, useRef } from 'react'
import { RUNES, drawRune, rng } from '../lib/runes.js'

/**
 * Faint runes inked across the parchment. Static layer is drawn once; only
 * the occasional "glint" (a rune catching candlelight) animates.
 */
export function RuneField({ reduced }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let runes = []
    let glints = []
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    function layout() {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const r = rng(1337)
      runes = []
      const cell = 96
      for (let y = cell / 2; y < h + cell; y += cell) {
        for (let x = cell / 2; x < w + cell; x += cell) {
          if (r() < 0.35) continue
          runes.push({
            x: x + (r() - 0.5) * 40,
            y: y + (r() - 0.5) * 40,
            s: 18 + r() * 22,
            rot: (r() - 0.5) * 0.5,
            g: RUNES[Math.floor(r() * RUNES.length)],
            a: 0.05 + r() * 0.07,
          })
        }
      }
      drawStatic()
    }

    function drawStatic() {
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = 'round'
      for (const q of runes) {
        ctx.save()
        ctx.translate(q.x, q.y)
        ctx.rotate(q.rot)
        ctx.strokeStyle = `rgba(52, 30, 10, ${q.a})`
        ctx.lineWidth = 2.2
        drawRune(ctx, q.g, -q.s / 2, -q.s / 2, q.s)
        ctx.restore()
      }
    }

    let last = performance.now()
    let nextGlint = 800
    function frame(now) {
      raf = requestAnimationFrame(frame)
      const dt = now - last
      last = now
      nextGlint -= dt
      if (nextGlint <= 0 && runes.length) {
        nextGlint = 900 + Math.random() * 1800
        glints.push({ q: runes[Math.floor(Math.random() * runes.length)], t: 0, life: 2600 + Math.random() * 1600 })
      }
      if (!glints.length) return
      drawStatic()
      glints = glints.filter((g) => (g.t += dt) < g.life)
      for (const g of glints) {
        const p = g.t / g.life
        const env = Math.sin(p * Math.PI)
        const q = g.q
        ctx.save()
        ctx.translate(q.x, q.y)
        ctx.rotate(q.rot)
        ctx.shadowColor = `rgba(255, 196, 80, ${env})`
        ctx.shadowBlur = 14 * env
        ctx.strokeStyle = `rgba(214, 150, 40, ${0.75 * env})`
        ctx.lineWidth = 2.4
        drawRune(ctx, q.g, -q.s / 2, -q.s / 2, q.s)
        ctx.restore()
      }
    }

    layout()
    const ro = new ResizeObserver(layout)
    ro.observe(canvas)
    if (!reduced) raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [reduced])
  return <canvas ref={ref} className="rune-field" aria-hidden="true" />
}
