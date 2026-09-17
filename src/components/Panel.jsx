import { useEffect, useRef } from 'react'
import { Corners, Rule } from './Ornament.jsx'
import { Icon } from './icons.jsx'

/**
 * Placeholder panel for each menu item, presented as an unrolling scroll.
 * `children` lets a route (e.g. Settings) render its own controls.
 */
export function Panel({ item, onClose, children }) {
  const closeRef = useRef(null)
  useEffect(() => {
    closeRef.current?.focus()
  }, [item])
  if (!item) return null
  return (
    <div className="panel-backdrop" onClick={onClose}>
      <div className="panel" role="dialog" aria-modal="true" aria-labelledby="panel-title" onClick={(e) => e.stopPropagation()}>
        <div className="panel-roller top" aria-hidden="true" />
        <div className="panel-body">
          <Corners />
          <div className="panel-head">
            <span className="panel-icon">
              <Icon name={item.icon} />
            </span>
            <h2 id="panel-title">{item.label}</h2>
            <Rule />
          </div>
          <p className="panel-blurb">{item.blurb}</p>
          {children || (
            <p className="panel-stub">
              This hall is still being built. The <em>{item.label}</em> screen will open here.
            </p>
          )}
          <button ref={closeRef} type="button" className="panel-close" onClick={onClose}>
            <span className="key">B</span> Back
          </button>
        </div>
        <div className="panel-roller bottom" aria-hidden="true" />
      </div>
    </div>
  )
}
