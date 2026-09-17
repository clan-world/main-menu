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

---

## This branch: `prototype/fable-5-1`

Vite + React single-page app. No runtime dependencies beyond React. Every texture, plaque, icon, cursor and the hero painting is invented with image generation (prompts and pipeline in [`ART.md`](ART.md)); sound is synthesised.

### Run

```bash
npm install
npm run dev        # http://localhost:5173  (also on your LAN for phone testing)
npm run build      # static bundle in dist/
npm run preview
```

`pnpm install && pnpm dev` works the same.

### Controls

| Input | Action |
| --- | --- |
| Any key / tap | Enter from the boot splash (also unlocks audio) |
| `↑` `↓` (or `W`/`S`, `J`/`K`) | Move selection |
| `Enter` / `Space` / click / tap | Select |
| `Esc` | Back / close panel |
| Gamepad d-pad / left stick, `A`, `B` | Same as above; hint bar switches to pad glyphs |
| `F` | Fullscreen |
| `M` | Mute / unmute |

### Adding a menu button

Append an entry to `MENU` in [`src/menu.js`](src/menu.js). Icons live in [`src/components/icons.jsx`](src/components/icons.jsx). Whisper lines are in the same file.

### What was tried for console feel

See [`NOTES.md`](NOTES.md).

### Art

All visuals are generated, not stock. See [`ART.md`](ART.md) for every prompt, the Codex `image_gen` /
Grok Imagine pipeline, and how to regenerate:

```bash
python3 tools/gen_art.py                              # raw art via the Codex CLI → /tmp/cw-art/raw
RAW=/tmp/cw-art/raw python3 tools/build_assets.py     # crop / slice / optimise → public/art
```

### Screenshot / dev flags

`?boot=1` skips the splash, `?sel=N` preselects a row, `?open=<id>` opens a panel (useful for headless captures).
