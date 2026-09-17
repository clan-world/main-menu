// Corner flourishes + rivets that turn a rectangle into console chrome.
function Corner({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path d="M1 23 V6 Q1 1 6 1 H23" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M4 23 V8 Q4 4 8 4 H23" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <path d="M6 1 Q11 3 8 8 Q3 11 1 6" fill="currentColor" opacity="0.9" />
      <circle cx="4.5" cy="4.5" r="1.6" fill="#1a120a" />
    </svg>
  )
}

export function Corners() {
  return (
    <>
      <Corner className="corner tl" />
      <Corner className="corner tr" />
      <Corner className="corner bl" />
      <Corner className="corner br" />
    </>
  )
}

/** Horizontal divider with a central diamond, used under headings. */
export function Rule({ className = '' }) {
  return (
    <svg className={`rule ${className}`} viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 6 H86 M114 6 H200" stroke="currentColor" strokeWidth="1" />
      <path d="M100 1 L105 6 L100 11 L95 6 Z" fill="currentColor" />
      <circle cx="88" cy="6" r="1.5" fill="currentColor" />
      <circle cx="112" cy="6" r="1.5" fill="currentColor" />
    </svg>
  )
}
