import { forwardRef } from 'react'
import { Icon } from './icons.jsx'
import { ArtIcon } from './ArtIcon.jsx'

/**
 * A menu plaque. Three generated skins (idle / hover / pressed) are stacked and
 * crossfaded with opacity; see styles.css `.skin` and ART.md.
 */
export const MenuButton = forwardRef(function MenuButton(
  { item, selected, onSelect, onActivate, index },
  ref,
) {
  const cls = ['menu-btn', item.variant === 'primary' ? 'primary' : '', selected ? 'selected' : '']
    .filter(Boolean)
    .join(' ')
  return (
    <button
      ref={ref}
      type="button"
      className={cls}
      style={{ '--i': index }}
      onMouseEnter={() => onSelect(index, 'pointer')}
      onFocus={() => onSelect(index, 'focus')}
      onClick={() => onActivate(item)}
      aria-current={selected ? 'true' : undefined}
    >
      <span className="skin idle" aria-hidden="true" />
      <span className="skin hover" aria-hidden="true" />
      <span className="skin press" aria-hidden="true" />
      <span className="btn-frame" aria-hidden="true">
        <span className="shine" />
      </span>
      <span className="btn-plate" aria-hidden="true">
        <span className="plate-ring" />
        <ArtIcon name={item.icon} />
      </span>
      <span className="btn-text">
        <span className="btn-label">
          {item.label}
          {item.badge && <span className="badge">{item.badge}</span>}
        </span>
        <span className="btn-sub">{item.sub}</span>
      </span>
      <span className="btn-chev" aria-hidden="true">
        <Icon name="chevron" />
      </span>
    </button>
  )
})
