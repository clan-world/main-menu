import { useEffect, useRef } from 'react'
import { rng } from '../lib/runes.js'

// Where things are in the generated key art (public/art/hero.jpg, 1536x1024), as fractions.
const ART = { w: 1536, h: 1024, focusY: 0.55 }
const FIRE = { x: 0.735, y: 0.845 }
const MOON = { x: 0.87, y: 0.12 }
const BANNER = { x0: 0.05, x1: 0.3, y0: 0.05, y1: 0.7 }

/**
 * The living layer over the painted hero plate: the campfire breathes, embers
 * rise, fog rolls across the moor, stars twinkle, the moon halo pulses and
 * light plays across the banner cloth. Draws nothing opaque; the painting
 * underneath (an <img>, see HeroPanel) does the heavy lifting.
 */
export function HeroScene({ reduced, paused }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    let raf = 0
    const t0 = performance.now()
    const r = rng(7)

    // object-fit: cover mapping of the art into the canvas
    let sx = 1
    let ox = 0
    let oy = 0
    const px = (fx) => ox + fx * ART.w * sx
    const py = (fy) => oy + fy * ART.h * sx

    const stars = Array.from({ length: 34 }, () => ({ x: 0.3 + r() * 0.68, y: 0.02 + r() * 0.24, p: r() * 6.28, s: 0.7 + r() * 1.3 }))
    const fog = [0, 1, 2].map((i) => ({ y: 0.55 + i * 0.07, v: 6 + i * 4, ph: r() * 1000, a: 0.05 + i * 0.02 }))
    const embers = Array.from({ length: 40 }, () => ember(true))
    function ember(any) {
      return { x: (r() - 0.5) * 0.05, y: any ? -r() * 0.5 : 0, v: 0.05 + r() * 0.09, sw: r() * 6.28, s: 0.8 + r() * 1.8, life: any ? r() : 1 }
    }

    function layout() {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sx = Math.max(w / ART.w, h / ART.h)
      ox = (w - ART.w * sx) * 0.5
      oy = (h - ART.h * sx) * ART.focusY
      draw(performance.now())
    }

    const flick = (t) => 0.75 + 0.14 * Math.sin(t * 9.1) * Math.sin(t * 3.7) + 0.11 * Math.sin(t * 17.3 + 1)

    function draw(now) {
      const t = (now - t0) / 1000
      const S = ART.h * sx // art height on screen, our unit for sizes
      ctx.clearRect(0, 0, w, h)

      // --- fire glow (additive)
      const fx = px(FIRE.x)
      const fy = py(FIRE.y)
      const fl = reduced ? 0.85 : flick(t)
      ctx.globalCompositeOperation = 'lighter'
      const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, S * 0.34)
      fg.addColorStop(0, `rgba(255, 150, 50, ${0.32 * fl})`)
      fg.addColorStop(0.3, `rgba(220, 90, 30, ${0.12 * fl})`)
      fg.addColorStop(1, 'rgba(120, 40, 10, 0)')
      ctx.fillStyle = fg
      ctx.fillRect(fx - S * 0.34, fy - S * 0.34, S * 0.68, S * 0.68)
      // hot core
      const core = ctx.createRadialGradient(fx, fy - S * 0.01, 0, fx, fy - S * 0.01, S * 0.05)
      core.addColorStop(0, `rgba(255, 220, 140, ${0.45 * fl})`)
      core.addColorStop(1, 'rgba(255, 160, 60, 0)')
      ctx.fillStyle = core
      ctx.fillRect(fx - S * 0.05, fy - S * 0.06, S * 0.1, S * 0.1)

      // --- moon halo breathing
      const mx = px(MOON.x)
      const my = py(MOON.y)
      const mp = 0.12 + 0.05 * Math.sin(t * 0.6)
      const mg = ctx.createRadialGradient(mx, my, S * 0.03, mx, my, S * 0.22)
      mg.addColorStop(0, `rgba(210, 225, 255, ${mp})`)
      mg.addColorStop(1, 'rgba(210, 225, 255, 0)')
      ctx.fillStyle = mg
      ctx.fillRect(mx - S * 0.22, my - S * 0.22, S * 0.44, S * 0.44)

      // --- stars twinkle
      for (const s of stars) {
        const tw = Math.max(0, Math.sin(t * 1.3 + s.p)) ** 3
        if (tw < 0.05) continue
        ctx.fillStyle = `rgba(255, 245, 220, ${0.8 * tw})`
        const x = px(s.x)
        const y = py(s.y)
        ctx.fillRect(x - s.s * tw, y - 0.5, s.s * 2 * tw, 1)
        ctx.fillRect(x - 0.5, y - s.s * tw, 1, s.s * 2 * tw)
      }

      // --- light playing across the banner cloth
      const bx0 = px(BANNER.x0)
      const bx1 = px(BANNER.x1)
      const by0 = py(BANNER.y0)
      const by1 = py(BANNER.y1)
      const band = (bx1 - bx0) * 0.5
      const bp = bx0 - band + ((t * 26) % (bx1 - bx0 + band * 2))
      const bg = ctx.createLinearGradient(bp - band, 0, bp + band, 0)
      bg.addColorStop(0, 'rgba(255, 210, 150, 0)')
      bg.addColorStop(0.5, `rgba(255, 210, 150, ${0.07 + 0.03 * Math.sin(t * 2.2)})`)
      bg.addColorStop(1, 'rgba(255, 210, 150, 0)')
      ctx.fillStyle = bg
      ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0)

      // --- embers
      if (!reduced) {
        for (const e of embers) {
          e.y -= e.v * 0.016
          e.sw += 0.04
          e.life -= 0.0035
          if (e.life <= 0) Object.assign(e, ember(false))
          const ex = fx + (e.x + Math.sin(e.sw) * 0.012 + e.y * -0.04) * S
          const ey = fy + e.y * S * 0.7
          const a = Math.min(1, e.life * 2.5) * (0.5 + 0.5 * Math.sin(e.sw * 3))
          ctx.fillStyle = `rgba(255, ${140 + Math.floor(90 * e.life)}, 60, ${a})`
          ctx.beginPath()
          ctx.arc(ex, ey, e.s * (S / 900), 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalCompositeOperation = 'source-over'

      // --- fog rolling across the moor
      for (const f of fog) {
        const fyy = py(f.y)
        const len = w + S * 0.8
        const fxx = ((t * f.v + f.ph) % len) - S * 0.4
        const g = ctx.createRadialGradient(fxx, fyy, 0, fxx, fyy, S * 0.32)
        g.addColorStop(0, `rgba(190, 200, 225, ${f.a})`)
        g.addColorStop(1, 'rgba(190, 200, 225, 0)')
        ctx.fillStyle = g
        ctx.fillRect(fxx - S * 0.32, fyy - S * 0.12, S * 0.64, S * 0.24)
      }

      // --- vignette inside the frame
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.4, w / 2, h / 2, Math.max(w, h) * 0.8)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(1, 'rgba(0,0,0,0.55)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, w, h)
    }

    function frame(now) {
      raf = requestAnimationFrame(frame)
      if (paused) return
      draw(now)
    }

    layout()
    const ro = new ResizeObserver(layout)
    ro.observe(canvas)
    if (!reduced) raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [reduced, paused])

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />
}
