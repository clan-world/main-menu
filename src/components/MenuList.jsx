import { useEffect, useRef } from 'react'
import { MenuButton } from './MenuButton.jsx'
import { runePath, RUNES } from '../lib/runes.js'

export function MenuList({ items, selected, onSelect, onActivate, inputMode }) {
  const refs = useRef([])
  const markerRef = useRef(null)

  // Slide the selection marker to the selected button.
  useEffect(() => {
    const el = refs.current[selected]
    const m = markerRef.current
    if (!el || !m) return
    const parent = el.parentElement
    const r = el.getBoundingClientRect()
    const pr = parent.getBoundingClientRect()
    m.style.transform = `translateY(${r.top - pr.top + r.height / 2}px)`
  }, [selected, items.length])

  // When navigating by keys/gamepad, keep DOM focus in sync for a11y.
  useEffect(() => {
    if (inputMode !== 'pointer') refs.current[selected]?.focus({ preventScroll: true })
  }, [selected, inputMode])

  return (
    <nav className="menu" aria-label="Main menu">
      <div className="menu-marker" ref={markerRef} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path d={runePath(RUNES[15])} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" transform="rotate(90 12 12)" />
        </svg>
      </div>
      <ul className="menu-list">
        {items.map((item, i) => (
          <li key={item.id} style={{ '--i': i }}>
            <MenuButton
              ref={(el) => (refs.current[i] = el)}
              item={item}
              index={i}
              selected={i === selected}
              onSelect={onSelect}
              onActivate={onActivate}
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}
