# Clan World · The First Age

A standalone, playable main-menu prototype built with React and Vite. Ancient parchment, engraved brass and dark stone frame a living clan sanctuary.

## Run

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. `npm run build` creates `dist/`; `npm run preview` serves that build. Dependencies are locked with npm.

## Explore

- **Play now:** awaken three ancestral runes to open the sanctuary.
- **How to play:** an introduction to the prototype.
- **Gold Believers Campaign:** browse three founding-story chapters.
- **Pack ripping:** break a free preview pack's seal to reveal the Dawnkeeper.
- **Settings:** sound and motion preferences persist on this device.
- **Mini games:** repeat the inscription to solve the rune trial; wrong choices reset the trial.

Mouse, touch, Tab, Enter and Space work throughout. The main menu also supports Up/Down and Home/End. Escape closes a panel and restores focus. Dialogs contain keyboard focus. Sound starts disabled; reduced-motion preferences are honored. No accounts, payments, crypto or wallet connections. The campaign and pack contents are fixed demo content, not a live game service.

## Console feel

A single immersive scene replaces website navigation. Six extensible menu entries live in the `menu` array in `src/main.jsx`. Generated bronze plaques with painted idle/hover/pressed states, a gold Play now plaque, illustrated relic icons and cursors, short synthesized selection tones, a drifting sanctuary painting, rising crystal sparks and appearing/fading parchment whispers provide the game-menu treatment. Mobile brings the sanctuary above the full-size touch controls; desktop keeps the left stack and living right side.

All runtime art and fonts are local. The complete art pass uses original built-in image generation: parchment/runes, sanctuary, four plaque treatments, eight relic icons, and two alpha cursors (about 1.1 MiB total). Exact prompts, export details, and motion behavior are documented in [public/art/ART.md](public/art/ART.md). No Imagine/video tool was available; the living hero uses CSS animation of generated artwork. Cinzel and Crimson Text are bundled under their included SIL Open Font Licenses.

## Verify

```sh
npx playwright install chromium
npm test
npm run build
```

Playwright checks desktop (1440×900) and mobile (390×844): button order, horizontal overflow, keyboard navigation, focus restoration, rune awakening, pack reveal, trial completion, saved settings, and browser errors. Screenshots are saved in the ignored `test-results/` directory.

Reference study: all four images in `refs/cambria/`. The brief's X video was unavailable during implementation.
