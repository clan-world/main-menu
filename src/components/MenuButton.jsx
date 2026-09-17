import { forwardRef } from 'react'
import { Icon } from './icons.jsx'
import { Corners } from './Ornament.jsx'

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
      <span className="btn-frame" aria-hidden="true">
        <Corners />
        <span className="shine" />
      </span>
      <span className="btn-plate" aria-hidden="true">
        <span className="plate-ring" />
        <Icon name={item.icon} />
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
