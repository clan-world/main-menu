# Clan World — Astra v6

A standalone fantasy main-menu prototype: **The Verdant Gate**. Original generated art, a parchment hub, tactile jade-and-gold plaques, and a living painted world.

## Run

Requires Node.js 20.19+ (or 22.12+).

```sh
npm install
npm run dev
```

## GitHub Pages build

```sh
npm run build -- --base=/main-menu/astra-v6/
npm run preview
```

Open the preview at `/main-menu/astra-v6/`. All production art is imported through Vite, including the CSS cursor. Nothing is loaded from `refs/` or from a third-party asset service.

## Controls and features

- Mouse/touch, Tab, and native Enter/Space activation. Within the menu, ↑/↓ wrap and Home/End jump. Esc dismisses panels and restores selection.
- Play now: local journey preview. How to play: controls and activities. Campaign: story preview.
- Pack ripping: reveal three keepsakes. Mini games: playable ten-round Rune Hunt.
- Settings: saved sound and motion preferences. Synthesized selection chimes begin only after user interaction; sound defaults off. OS reduced-motion preference is respected.
- Narrow screens use a compact scene above full-width plaques. Desktop keeps the world alive beside the menu.

There is no multiplayer backend, authentication, inventory persistence, payment, or wallet integration. The campaign and world journey are explicitly labeled previews.

## Verify

```sh
npm run build -- --base=/main-menu/astra-v6/
npm test
```

Browser tests use Chrome at `/usr/bin/google-chrome`; set `CHROME_PATH` to your installed Chrome/Chromium executable if needed. Tests cover production-base asset requests, all menu panels, keyboard flow, saved settings, journey, pack reveal, Rune Hunt, and 390px/1440px screenshots.

See [NOTES.md](NOTES.md) for design decisions and [ART.md](ART.md) for art provenance and generation prompts. Screenshots are in `artifacts/`.
