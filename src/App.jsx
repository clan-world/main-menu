import { useCallback, useEffect, useState } from 'react'
import { MENU, WHISPERS } from './menu.js'
import { MenuList } from './components/MenuList.jsx'
import { HeroPanel } from './components/HeroPanel.jsx'
import { RuneField } from './components/RuneField.jsx'
import { Whisper } from './components/Whisper.jsx'
import { Splash } from './components/Splash.jsx'
import { Panel } from './components/Panel.jsx'
import { TopBar, HintBar } from './components/Chrome.jsx'
import { useGamepad } from './lib/useGamepad.js'
import { sfx, unlock, setEnabled, startAmbient, stopAmbient } from './lib/sound.js'

const prefersReduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
// Dev/screenshot affordances: ?boot=1 skips the splash, ?sel=N preselects a row, ?open=<id> opens a panel.
const QS = new URLSearchParams(window.location.search)

export default function App() {
  const [booted, setBooted] = useState(QS.has('boot'))
  const [leaving, setLeaving] = useState(false)
  const [selected, setSelected] = useState(Math.min(MENU.length - 1, Number(QS.get('sel')) || 0))
  const [inputMode, setInputMode] = useState('pointer')
  const [open, setOpen] = useState(() => MENU.find((m) => m.id === QS.get('open')) || null) // menu item shown in a panel
  const [launching, setLaunching] = useState(false)
  const [sound, setSound] = useState(true)
  const [reduced, setReduced] = useState(prefersReduced())

  // --- boot
  const enter = useCallback(() => {
    if (booted || leaving) return
    unlock()
    setLeaving(true)
    sfx.boot()
    if (sound) startAmbient()
    setTimeout(() => setBooted(true), 900)
  }, [booted, leaving, sound])

  useEffect(() => {
    if (booted) return
    const onKey = (e) => {
      if (e.key === 'Escape' || e.metaKey || e.ctrlKey || e.altKey) return
      enter()
    }
    window.addEventListener('keydown', onKey)
    const onPad = () => enter()
    window.addEventListener('gamepadconnected', onPad)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('gamepadconnected', onPad)
    }
  }, [booted, enter])

  // --- selection & activation
  const select = useCallback((i, mode) => {
    setSelected((prev) => {
      if (prev !== i) sfx.hover()
      return i
    })
    if (mode) setInputMode(mode)
  }, [])

  const activate = useCallback(
    (item) => {
      if (launching) return
      if (item.id === 'play') {
        sfx.play()
        setLaunching(true)
        setTimeout(() => setLaunching(false), 3600)
        return
      }
      sfx.confirm()
      setOpen(item)
    },
    [launching],
  )

  const back = useCallback(() => {
    if (open) {
      sfx.back()
      setOpen(null)
    }
  }, [open])

  const move = useCallback(
    (dir) => {
      setInputMode((m) => (m === 'gamepad' ? m : 'keys'))
      setSelected((s) => {
        const n = (s + dir + MENU.length) % MENU.length
        sfx.hover()
        return n
      })
    },
    [],
  )

  // keyboard
  useEffect(() => {
    if (!booted) return
    const onKey = (e) => {
      if (e.key === 'Escape') return back()
      if (open) return
      if (e.key === 'ArrowDown' || e.key === 'j' || e.key === 's') {
        e.preventDefault()
        move(1)
      } else if (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'w') {
        e.preventDefault()
        move(-1)
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (document.activeElement?.classList.contains('menu-btn')) return // native click handles it
        e.preventDefault()
        activate(MENU[selected])
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen()
      } else if (e.key === 'm' || e.key === 'M') {
        toggleSound()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // gamepad
  useGamepad(
    {
      move: (d) => {
        setInputMode('gamepad')
        if (!open) move(d)
      },
      confirm: () => {
        setInputMode('gamepad')
        if (!open) activate(MENU[selected])
      },
      back,
    },
    booted,
  )

  // no browser chrome behaviours: right click, drag, pinch
  useEffect(() => {
    const stop = (e) => e.preventDefault()
    document.addEventListener('contextmenu', stop)
    document.addEventListener('dragstart', stop)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = () => setReduced(mq.matches)
    mq.addEventListener?.('change', onMq)
    return () => {
      document.removeEventListener('contextmenu', stop)
      document.removeEventListener('dragstart', stop)
      mq.removeEventListener?.('change', onMq)
    }
  }, [])

  function toggleSound() {
    setSound((s) => {
      const v = !s
      setEnabled(v)
      if (v) startAmbient()
      else stopAmbient()
      return v
    })
  }
  function toggleFullscreen() {
    const el = document.documentElement
    if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen?.()
  }

  const current = MENU[selected]

  return (
    <div className={`console ${booted ? 'booted' : ''} mode-${inputMode}`}>
      <div className="parchment" aria-hidden="true" />
      <RuneField reduced={reduced} />
      <div className="grain" aria-hidden="true" />

      {booted && (
        <>
          <TopBar sound={sound} onToggleSound={toggleSound} onFullscreen={toggleFullscreen} />
          <main className="stage">
            <MenuList items={MENU} selected={selected} onSelect={select} onActivate={activate} inputMode={inputMode} />
            <HeroPanel reduced={reduced} paused={!!open || launching} item={current} onPlay={() => activate(MENU[0])} />
          </main>
          <Whisper lines={WHISPERS} reduced={reduced} />
          <HintBar inputMode={inputMode} />
        </>
      )}

      <Panel item={open} onClose={back}>
        {open?.id === 'settings' && (
          <div className="settings">
            <label className="toggle">
              <input type="checkbox" checked={sound} onChange={toggleSound} />
              <span className="toggle-ui" aria-hidden="true" />
              <span>Sound & ambience</span>
            </label>
            <label className="toggle">
              <input type="checkbox" checked={reduced} onChange={() => setReduced((r) => !r)} />
              <span className="toggle-ui" aria-hidden="true" />
              <span>Reduce motion</span>
            </label>
            <button type="button" className="ghost-btn" onClick={toggleFullscreen}>
              Toggle fullscreen <span className="key">F</span>
            </button>
          </div>
        )}
      </Panel>

      {launching && (
        <div className="launch" aria-live="assertive">
          <div className="launch-inner">
            <span className="launch-title">Entering the realm</span>
            <span className="launch-bar">
              <span className="launch-fill" />
            </span>
            <span className="launch-tip">Tip: a clan that marches together, loots together.</span>
          </div>
        </div>
      )}

      {!booted && <Splash onEnter={enter} leaving={leaving} />}
    </div>
  )
}
