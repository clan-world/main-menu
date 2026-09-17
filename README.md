# Clan World — Main Menu prototypes

Console-feel main menu bake-off. Not a website. Immersive hub for Play Now / How to play / campaigns / packs / settings / mini-games.

## Branches

| Branch | Model | Tool |
| --- | --- | --- |
| `prototype/astra-gpt6` | GPT-6 Astra | Codex CLI |
| `prototype/fable-5-1` | Fable 5.1 | Claude Code CLI |
| `prototype/grok-4-6` | Grok 4.6 | Grok Build CLI |

Shared brief: [`BRIEF.md`](BRIEF.md). Cambria visual refs: [`refs/cambria/`](refs/cambria/).

## Criteria

- Feels like a **console game** main menu in the browser (Cambria.gg direction + Clan World parchment/runes).
- Avoid “divs with basic styling.” Textured, ornamented buttons. Custom cursors. Immersive chrome.
- Mobile + desktop.

## This branch (`prototype/grok-4-6`)

Vite + React hub. Imagine-invented parchment, rune veil, ornamented plaques (idle/hover/pressed + primary), camp scene with a looping hearth clip, icons, and pixel cursors live in `public/art/` and `public/cursors/`. Prompts: [`ART.md`](ART.md).

### Run

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

```bash
npm run build
npm run preview
```

`pnpm` / `yarn` work too if you prefer.

### Controls

- Mouse / touch to highlight and confirm
- `↑` `↓` or `W` `S` to move the selection
- `Enter` / `Space` to confirm
- `1`–`6` jump to a slot
- Speaker button mutes menu ticks

No wallet, no token chrome, no account modal.

Console-feel notes: [`NOTES.md`](NOTES.md).
