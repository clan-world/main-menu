// Generated embossed-gold menu icons (public/art/icons, one sprite per menu entry).
// Prompts and provenance: ART.md. Add a new icon by dropping `<name>.webp` in that folder.
export const ART_ICONS = {
  sword: '/art/icons/sword.webp',
  scroll: '/art/icons/scroll.webp',
  sun: '/art/icons/sun.webp',
  cards: '/art/icons/cards.webp',
  cog: '/art/icons/cog.webp',
  dice: '/art/icons/dice.webp',
}

export function ArtIcon({ name, size, alt = '' }) {
  const src = ART_ICONS[name]
  if (!src) return null
  return <img src={src} alt={alt} width={size} height={size} draggable={false} decoding="async" />
}
