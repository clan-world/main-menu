# Fable 5.1 v2 — notes

Fourth bake-off pass after Mikail feedback on v1 (closest, still wrong).

- Mobile-first stack: dedicated hooks / layout so ~390px is intentional, not a squashed desktop.
- All art imported through Vite modules (`src/assets.ts`) so GitHub Pages base paths cannot break images.
- Invented plates, icons, parchment, cursors, hero via image generation (see `art/` + `src/art/`).
- Left menu + living hero + whisper parchment loop. Buttons: Play now, How to play, Gold Believers Campaign, Pack ripping, Settings, Mini games.
