# Astra GPT-6 v5 — text-only image gen → implement

You are on branch `prototype/astra-gpt6-v5` in THIS worktree only. Do not touch other branches or sibling worktrees.

## Goal
Build a Clan World MAIN MENU that feels like a console game hub in the browser (NOT a website).

## Process (required order)
1. Read `BRIEF.md` and study `refs/cambria/` for lobby direction.
2. **Invent ALL art with Codex image generation from TEXT BRIEFS ONLY.** Do NOT open or copy pixels from `refs/fable-v2/` or `refs/buttons/` for generation. Those folders may exist for other experiments — ignore them for v5.
3. Generate: parchment/runes background, primary + secondary button plates, icons for each menu item, custom cursors, crest/wordmark, living right-side scene (or animation frames), ornaments.
4. Implement Vite + React SPA using **imported assets** (or `import.meta.env.BASE_URL`) so `vite build --base=/main-menu/astra-v5/` never breaks image paths.
5. Commit and push this branch. Write `NOTES.md`, `ART.md` / `PROVENANCE.md`.

## UX
- Left vertical button stack + living/animated right side
- Looping parchment whisper text (appears then fades)
- Buttons in order: Play now (CTA), How to play, Gold Believers Campaign, Pack ripping, Settings, Mini games — extensible
- Mobile (~390px) AND desktop must both feel intentional
- Textured ornamented buttons, custom cursors, no flat web chrome
- No crypto/wallet

## Hard criteria
- No broken assets under GH Pages base `/main-menu/astra-v5/`
- Invented art only (no stock)
- Playable with `pnpm install && pnpm dev` (or npm)
