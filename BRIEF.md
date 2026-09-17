# Clan World main menu — prototype brief

You are building a **standalone main-menu prototype** for Clan World. This is a game hub, not a marketing site.

## Non-negotiable feel

- Must feel like the user is on a **real gaming console**, not browsing a website.
- Anti-metric: regular `div`s with flat CSS. Buttons need texture, ornaments, proper game chrome.
- Custom game cursors. Immersive background. Mobile + desktop.
- Reference direction: **Cambria.gg** main menu / hub (button style, background texture, cursors) — Clan World flavor, not a Cambria clone.
- Also keep in mind: browser games should feel like a console (see Mikail’s parked ref: https://x.com/gambala_pro/status/2098754130646827303/video/1?s=46).
- Screenshots of Cambria UI live in `refs/cambria/` if present — study those.

## Layout

- **Left:** vertical list of menu buttons.
- **Right:** something living / animated (not a dead stock photo).
- **Background:** runes-like ancient paper / parchment texture.
- Optional loop on the parchment: text appearing then fading away (ink / whisper vibe).

## Buttons (order)

1. **Play now** — primary CTA (strongest visual weight)
2. How to play
3. Gold Believers Campaign
4. Pack ripping
5. Settings
6. Mini games
7. Leave room to add more later (extensible list)

Buttons can be non-functional stubs / routes that show a placeholder panel — this is a visual/interaction prototype first.

## Stack

- Prefer a simple Vite + React (or vanilla HTML/CSS/JS) single-page app that runs with `pnpm dev` or `npm run dev`.
- No crypto / wallet wiring in this prototype.
- Ship something playable in the browser locally; document how to run in README for this branch.

## Deliverable

- Working prototype on this branch only (do not rewrite other branches).
- README section: how to run + what you tried for console feel.
- Keep art assets in-repo (generated textures OK). Optimize for snappy load.
