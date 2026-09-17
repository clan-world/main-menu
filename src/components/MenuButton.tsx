import type { MenuItem } from "../data/menu";

type Props = {
  item: MenuItem;
  selected: boolean;
  onSelect: () => void;
  onConfirm: () => void;
};

export default function MenuButton({ item, selected, onSelect, onConfirm }: Props) {
  return (
    <button
      type="button"
      className={`menu-btn ${item.primary ? "is-primary" : ""} ${selected ? "is-selected" : ""}`}
      data-hoverable
      aria-current={selected ? "true" : undefined}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onConfirm}
    >
      <span className="menu-btn-plate idle" aria-hidden="true" />
      <span className="menu-btn-plate hover" aria-hidden="true" />
      <span className="menu-btn-plate pressed" aria-hidden="true" />
      <img className="menu-btn-icon" src={item.icon} alt="" />
      <span className="menu-btn-copy">
        <span className="menu-btn-title">{item.title}</span>
        <span className="menu-btn-sub">{item.subtitle}</span>
      </span>
      {selected ? <span className="menu-btn-caret" aria-hidden="true" /> : null}
    </button>
  );
}
