import { useEffect, useRef } from 'react'
import { RUNES, drawRune, rng } from '../lib/runes.js'

/**
 * A living painting: night sky, drifting mountain ridges, fog, a campfire that
 * flickers, rising embers, and a waving clan banner. Pure canvas, no assets.
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
    let t0 = performance.now()
    const r = rng(42)

    // ---- static-ish data
    const stars = Array.from({ length: 90 }, () => ({ x: r(), y: r() * 0.6, s: 0.6 + r() * 1.4, p: r() * 6.28 }))
    const ridges = [0, 1, 2].map((k) => ({
      k,
      seeds: Array.from({ length: 5 }, () => ({ f: 1 + Math.floor(r() * 6), a: r(), p: r() * 6.28 })),
    }))
    const embers = Array.from({ length: 46 }, () => spawnEmber(true))
    function spawnEmber(any) {
      return { x: r(), y: any ? r() : 1, v: 0.05 + r() * 0.1, sw: r() * 6.28, s: 1 + r() * 2, life: r() }
    }

    // ---- banner texture (drawn once)
    const bw = 260
    const bh = 380
    const off = document.createElement('canvas')
    off.width = bw * dpr
    off.height = bh * dpr
    const o = off.getContext('2d')
    o.setTransform(dpr, 0, 0, dpr, 0, 0)
    paintBanner(o, bw, bh)

    function paintBanner(c, W, H) {
      const g = c.createLinearGradient(0, 0, W, 0)
      g.addColorStop(0, '#5a0f12')
      g.addColorStop(0.5, '#8c1c1f')
      g.addColorStop(1, '#5a0f12')
      c.fillStyle = g
      c.fillRect(0, 0, W, H)
      // cloth weave
      c.globalAlpha = 0.08
      c.strokeStyle = '#000'
      for (let y = 0; y < H; y += 3) {
        c.beginPath()
        c.moveTo(0, y)
        c.lineTo(W, y)
        c.stroke()
      }
      c.globalAlpha = 1
      // gold border
      c.lineWidth = 8
      c.strokeStyle = '#c8962e'
      c.strokeRect(4, 4, W - 8, H - 8)
      c.lineWidth = 2
      c.strokeStyle = '#f5d98a'
      c.strokeRect(14, 14, W - 28, H - 28)
      // emblem ring
      const cx = W / 2
      const cy = H * 0.42
      c.beginPath()
      c.arc(cx, cy, 86, 0, Math.PI * 2)
      c.lineWidth = 6
      c.strokeStyle = '#c8962e'
      c.stroke()
      // rune ring
      c.save()
      c.translate(cx, cy)
      c.strokeStyle = '#f5d98a'
      c.lineWidth = 2
      c.lineCap = 'round'
      for (let i = 0; i < 12; i++) {
        c.save()
        c.rotate((i / 12) * Math.PI * 2)
        drawRune(c, RUNES[(i * 5) % RUNES.length], -6, -78, 12)
        c.restore()
      }
      c.restore()
      // shield
      c.beginPath()
      c.moveTo(cx - 44, cy - 50)
      c.lineTo(cx + 44, cy - 50)
      c.lineTo(cx + 44, cy + 6)
      c.quadraticCurveTo(cx + 44, cy + 46, cx, cy + 62)
      c.quadraticCurveTo(cx - 44, cy + 46, cx - 44, cy + 6)
      c.closePath()
      c.fillStyle = '#1a120a'
      c.fill()
      c.lineWidth = 3
      c.strokeStyle = '#f5d98a'
      c.stroke()
      // tower
      c.fillStyle = '#e2b04a'
      c.fillRect(cx - 14, cy - 18, 28, 60)
      for (let i = 0; i < 3; i++) c.fillRect(cx - 14 + i * 10, cy - 26, 7, 9)
      c.fillStyle = '#1a120a'
      c.fillRect(cx - 4, cy + 20, 8, 22)
      // stars
      c.fillStyle = '#f5d98a'
      for (const [sx, sy] of [[-26, -36], [0, -42], [26, -36]]) {
        star(c, cx + sx, cy + sy, 5)
      }
      // ribbon text band
      c.fillStyle = '#c8962e'
      c.fillRect(30, H - 90, W - 60, 30)
      c.fillStyle = '#1a120a'
      c.font = '700 15px Cinzel, serif'
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.fillText('CLAN WORLD', W / 2, H - 75)
    }
    function star(c, x, y, R) {
      c.beginPath()
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2
        const rr = i % 2 ? R * 0.45 : R
        c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr)
      }
      c.closePath()
      c.fill()
    }

    function layout() {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(performance.now())
    }

    const ridgeY = (ridge, x, base, amp) => {
      let y = 0
      for (const s of ridge.seeds) y += Math.sin((x * s.f * Math.PI * 2) + s.p) * s.a
      return base + (y / ridge.seeds.length) * amp
    }

    function flick(t) {
      return 0.78 + 0.12 * Math.sin(t * 9.1) * Math.sin(t * 3.7) + 0.1 * Math.sin(t * 17.3 + 1)
    }

    function draw(now) {
      const t = (now - t0) / 1000
      const wide = w / h > 1.6
      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, h)
      sky.addColorStop(0, '#080a1a')
      sky.addColorStop(0.55, '#1c1a33')
      sky.addColorStop(0.85, '#4a2a22')
      sky.addColorStop(1, '#2a1410')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, w, h)

      // stars
      for (const s of stars) {
        const tw = 0.55 + 0.45 * Math.sin(t * 1.7 + s.p)
        ctx.fillStyle = `rgba(255, 240, 210, ${0.35 + 0.55 * tw})`
        ctx.fillRect(s.x * w, s.y * h, s.s, s.s)
      }

      // moon
      const mx = w * 0.8
      const my = h * 0.2
      const mr = Math.min(w, h) * 0.075
      const mg = ctx.createRadialGradient(mx, my, mr * 0.6, mx, my, mr * 4)
      mg.addColorStop(0, 'rgba(255, 236, 190, 0.35)')
      mg.addColorStop(1, 'rgba(255, 236, 190, 0)')
      ctx.fillStyle = mg
      ctx.fillRect(mx - mr * 4, my - mr * 4, mr * 8, mr * 8)
      ctx.fillStyle = '#f7e9c4'
      ctx.beginPath()
      ctx.arc(mx, my, mr, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(190, 170, 130, 0.35)'
      ctx.beginPath()
      ctx.arc(mx - mr * 0.3, my - mr * 0.2, mr * 0.28, 0, Math.PI * 2)
      ctx.arc(mx + mr * 0.35, my + mr * 0.3, mr * 0.18, 0, Math.PI * 2)
      ctx.fill()

      // ridges (parallax drift)
      const ridgeCols = ['#171a2c', '#100f1e', '#0a0812']
      ridges.forEach((rg, k) => {
        const base = h * (0.56 + k * 0.11)
        const amp = h * (0.16 - k * 0.03)
        const off = t * (0.004 + k * 0.004)
        ctx.beginPath()
        ctx.moveTo(0, h)
        for (let x = 0; x <= w; x += 4) {
          ctx.lineTo(x, ridgeY(rg, x / w + off, base, amp))
        }
        ctx.lineTo(w, h)
        ctx.closePath()
        ctx.fillStyle = ridgeCols[k]
        ctx.fill()
      })

      // campfire glow (bottom right)
      const fx = w * 0.72
      const fy = h * 0.96
      const fl = flick(t)
      const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, Math.max(w, h) * 0.42)
      fg.addColorStop(0, `rgba(255, 150, 50, ${0.55 * fl})`)
      fg.addColorStop(0.35, `rgba(220, 90, 30, ${0.22 * fl})`)
      fg.addColorStop(1, 'rgba(120, 40, 10, 0)')
      ctx.fillStyle = fg
      ctx.fillRect(0, 0, w, h)
      // fire tongues
      ctx.save()
      ctx.translate(fx, fy)
      for (let i = 0; i < 7; i++) {
        const ph = t * 6 + i * 1.3
        const hgt = (26 + 18 * Math.sin(ph) * Math.sin(ph * 0.53)) * (h / 400) * fl
        const dx = (i - 3) * 8 * (h / 400)
        const gr = ctx.createLinearGradient(0, 0, 0, -hgt)
        gr.addColorStop(0, 'rgba(255, 210, 90, 0.95)')
        gr.addColorStop(0.5, 'rgba(255, 110, 30, 0.7)')
        gr.addColorStop(1, 'rgba(255, 60, 10, 0)')
        ctx.fillStyle = gr
        ctx.beginPath()
        ctx.moveTo(dx - 5, 0)
        ctx.quadraticCurveTo(dx + Math.sin(ph) * 6, -hgt * 0.6, dx, -hgt)
        ctx.quadraticCurveTo(dx - Math.sin(ph) * 6, -hgt * 0.6, dx + 5, 0)
        ctx.fill()
      }
      ctx.restore()

      // fog bands
      for (let i = 0; i < 4; i++) {
        const fyy = h * (0.62 + i * 0.09)
        const fxx = ((t * (8 + i * 5) + i * 300) % (w + 600)) - 300
        const fgd = ctx.createRadialGradient(fxx, fyy, 0, fxx, fyy, 260)
        fgd.addColorStop(0, 'rgba(180, 170, 200, 0.08)')
        fgd.addColorStop(1, 'rgba(180, 170, 200, 0)')
        ctx.fillStyle = fgd
        ctx.fillRect(fxx - 260, fyy - 80, 520, 160)
      }

      // ground
      ctx.fillStyle = '#07050a'
      ctx.beginPath()
      ctx.moveTo(0, h)
      ctx.lineTo(0, h * 0.9)
      for (let x = 0; x <= w; x += 6) ctx.lineTo(x, h * 0.9 + Math.sin(x * 0.05) * 3 + Math.sin(x * 0.013) * 8)
      ctx.lineTo(w, h)
      ctx.closePath()
      ctx.fill()

      // banner
      const scale = wide ? h / 760 : Math.min(h / 700, w / 720)
      const bW = bw * scale
      const bH = bh * scale
      const px = w * 0.27 - bW / 2
      const py = h * 0.12
      // pole
      ctx.fillStyle = '#2a1a0c'
      ctx.fillRect(px - 8 * scale, py - 20 * scale, 8 * scale, h - py + 40)
      ctx.fillStyle = '#c8962e'
      ctx.beginPath()
      ctx.moveTo(px - 4 * scale, py - 44 * scale)
      ctx.lineTo(px + 6 * scale, py - 22 * scale)
      ctx.lineTo(px - 14 * scale, py - 22 * scale)
      ctx.closePath()
      ctx.fill()
      // cloth strips
      const step = 3
      const amp = 10 * scale
      const wind = reduced ? 0 : 1
      for (let i = 0; i < bW; i += step) {
        const u = i / bW
        const ph = u * 4.2 - t * 2.6
        const dy = Math.sin(ph) * amp * (0.15 + u) * wind + Math.sin(t * 0.7) * 3 * u
        const sx = (i / scale) * dpr
        ctx.drawImage(off, sx, 0, (step / scale) * dpr, bh * dpr, px + i, py + dy, step + 0.6, bH)
        const shade = Math.cos(ph) * 0.28 * (0.2 + u) * wind
        ctx.fillStyle = shade > 0 ? `rgba(255, 230, 190, ${shade})` : `rgba(0, 0, 0, ${-shade})`
        ctx.fillRect(px + i, py + dy, step + 0.6, bH)
      }

      // embers
      for (const e of embers) {
        e.y -= e.v * 0.016 * (reduced ? 0.2 : 1)
        e.sw += 0.03
        e.life -= 0.003
        if (e.y < 0.1 || e.life <= 0) Object.assign(e, spawnEmber(false), { x: 0.6 + r() * 0.3 })
        const ex = (e.x + Math.sin(e.sw) * 0.02) * w
        const ey = e.y * h
        const a = Math.min(1, e.life * 2) * (0.5 + 0.5 * Math.sin(e.sw * 3))
        ctx.fillStyle = `rgba(255, ${150 + Math.floor(80 * e.life)}, 60, ${a})`
        ctx.beginPath()
        ctx.arc(ex, ey, e.s, 0, Math.PI * 2)
        ctx.fill()
      }

      // vignette inside frame
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(1, 'rgba(0,0,0,0.65)')
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
