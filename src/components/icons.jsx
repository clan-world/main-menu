// Inline, stroke-based icons so they inherit the gold/ink colour of their plate.
const base = {
  width: 28,
  height: 28,
  viewBox: '0 0 28 28',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const ICONS = {
  sword: () => (
    <svg {...base}>
      <path d="M5 23 L18 10" />
      <path d="M18 10 L23 4 L24 5 L18 11" />
      <path d="M17 12 L22 17" />
      <path d="M8 16 L12 20" />
      <path d="M4 24 L6 22" strokeWidth={2.6} />
      <path d="M9 19 L7 21" />
    </svg>
  ),
  scroll: () => (
    <svg {...base}>
      <path d="M7 6 h13 a3 3 0 0 1 3 3 v1 h-4" />
      <path d="M7 6 a3 3 0 0 0 -3 3 v1 h6 v-1 a3 3 0 0 0 -3 -3 z" />
      <path d="M10 10 v8 a3 3 0 0 1 -3 3 h11 a3 3 0 0 0 3 -3 v-8" />
      <path d="M7 21 a3 3 0 0 1 -3 -3" />
      <path d="M13 13 h5 M13 16 h5" strokeWidth={1.4} />
    </svg>
  ),
  sun: () => (
    <svg {...base}>
      <circle cx="14" cy="14" r="5" />
      <path d="M14 3 v3 M14 22 v3 M3 14 h3 M22 14 h3 M6.2 6.2 l2.1 2.1 M19.7 19.7 l2.1 2.1 M6.2 21.8 l2.1 -2.1 M19.7 8.3 l2.1 -2.1" />
    </svg>
  ),
  cards: () => (
    <svg {...base}>
      <rect x="9" y="5" width="12" height="17" rx="1.5" transform="rotate(8 15 13)" />
      <rect x="6" y="6" width="12" height="17" rx="1.5" fill="#1a120a" />
      <path d="M9.5 9 l2 3.5 -2 3.5 M14.5 9 l-2 3.5 2 3.5" strokeWidth={1.4} />
    </svg>
  ),
  cog: () => (
    <svg {...base}>
      <circle cx="14" cy="14" r="3.5" />
      <path d="M14 3.5 v3 M14 21.5 v3 M3.5 14 h3 M21.5 14 h3 M6.6 6.6 l2.1 2.1 M19.3 19.3 l2.1 2.1 M6.6 21.4 l2.1 -2.1 M19.3 8.7 l2.1 -2.1" strokeWidth={2.4} />
      <circle cx="14" cy="14" r="7.5" />
    </svg>
  ),
  dice: () => (
    <svg {...base}>
      <rect x="4" y="9" width="14" height="14" rx="2.5" />
      <path d="M8 5 l10 0 l6 6 v10 l-4 2" />
      <circle cx="8" cy="13" r="1.1" fill="currentColor" />
      <circle cx="14" cy="19" r="1.1" fill="currentColor" />
      <circle cx="11" cy="16" r="1.1" fill="currentColor" />
      <circle cx="8" cy="19" r="1.1" fill="currentColor" />
      <circle cx="14" cy="13" r="1.1" fill="currentColor" />
    </svg>
  ),
  chevron: () => (
    <svg {...base} width={18} height={18}>
      <path d="M9 5 L18 14 L9 23" />
    </svg>
  ),
  speaker: ({ muted }) => (
    <svg {...base} width={22} height={22}>
      <path d="M4 11 h4 l5 -4 v14 l-5 -4 h-4 z" fill="currentColor" stroke="none" />
      {muted ? <path d="M17 10 l6 8 M23 10 l-6 8" /> : <path d="M17 10 a5 5 0 0 1 0 8 M19.5 7 a9 9 0 0 1 0 14" />}
    </svg>
  ),
  expand: () => (
    <svg {...base} width={22} height={22}>
      <path d="M5 11 V5 h6 M23 11 V5 h-6 M5 17 v6 h6 M23 17 v6 h-6" />
    </svg>
  ),
}

export function Icon({ name, ...props }) {
  const C = ICONS[name]
  return C ? <C {...props} /> : null
}
