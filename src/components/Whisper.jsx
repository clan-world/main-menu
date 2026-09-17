import { useEffect, useState } from 'react'

const HOLD = 3200
const WRITE_PER_CHAR = 38
const FADE = 1400

/**
 * Ink that writes itself onto the parchment, lingers, and bleeds away.
 * Cycles through `lines`; each line gets a slightly different slot/tilt.
 */
export function Whisper({ lines, reduced }) {
  const [state, setState] = useState({ i: 0, phase: 'write', key: 0 })

  useEffect(() => {
    const text = lines[state.i]
    const writeMs = reduced ? 400 : text.length * WRITE_PER_CHAR
    const t =
      state.phase === 'write'
        ? setTimeout(() => setState((s) => ({ ...s, phase: 'hold' })), writeMs + 300)
        : state.phase === 'hold'
          ? setTimeout(() => setState((s) => ({ ...s, phase: 'fade' })), HOLD)
          : setTimeout(
              () => setState((s) => ({ i: (s.i + 1) % lines.length, phase: 'write', key: s.key + 1 })),
              FADE,
            )
    return () => clearTimeout(t)
  }, [state, lines, reduced])

  const text = lines[state.i]
  const slot = state.key % 3
  return (
    <div className={`whisper slot-${slot} ${state.phase}`} aria-live="polite" key={state.key}>
      <span className="whisper-line">
        {text.split('').map((ch, i) => (
          <span key={i} className="ch" style={{ '--d': `${reduced ? 0 : i * WRITE_PER_CHAR}ms` }}>
            {ch}
          </span>
        ))}
      </span>
    </div>
  )
}
