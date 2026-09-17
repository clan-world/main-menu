import { useEffect, useRef } from 'react'

/** Polls the Gamepad API and emits console-style events: up/down/confirm/back. */
export function useGamepad(handlers, active = true) {
  const h = useRef(handlers)
  h.current = handlers
  useEffect(() => {
    if (!active || !navigator.getGamepads) return
    let raf = 0
    let lastY = 0
    let lastA = false
    let lastB = false
    let repeatAt = 0
    const poll = (now) => {
      raf = requestAnimationFrame(poll)
      const gp = navigator.getGamepads()[0]
      if (!gp) return
      const y = gp.axes[1] || 0
      const up = gp.buttons[12]?.pressed || y < -0.5
      const down = gp.buttons[13]?.pressed || y > 0.5
      const dir = up ? -1 : down ? 1 : 0
      if (dir !== 0 && (dir !== lastY || now > repeatAt)) {
        h.current.move?.(dir)
        repeatAt = now + (dir !== lastY ? 350 : 140)
      }
      lastY = dir
      const a = gp.buttons[0]?.pressed
      const b = gp.buttons[1]?.pressed
      if (a && !lastA) h.current.confirm?.()
      if (b && !lastB) h.current.back?.()
      lastA = a
      lastB = b
    }
    raf = requestAnimationFrame(poll)
    return () => cancelAnimationFrame(raf)
  }, [active])
}
