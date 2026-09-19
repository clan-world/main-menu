# Astra GPT-6 v6 — text + visual refs image gen → implement

You are on branch `prototype/astra-gpt6-v6` in THIS worktree only. Do not touch other branches or sibling worktrees.

## Goal
Build a Clan World MAIN MENU that feels like a console game hub in the browser (NOT a website). Improve on prior bake-off attempts.

## Process (required order)
1. Read `BRIEF.md` and study `refs/cambria/`.
2. Study these visual refs BEFORE generating art:
   - `refs/buttons/enter-world-plaque.png` — **button language lock**: moss/olive beveled stone-jade body, cream text, metallic gold pointed star end-caps. Recreate this plaque energy for Clan World menu buttons (labels differ; style matches).
   - `refs/fable-v2/` art pack + live preview https://clan-world.github.io/main-menu/fable-v2/ — Fable v2 was directionally closest (parchment hub, left stack, living right). Do NOT copy its code. Steal the *feel*, then invent new assets.
3. **Invent ALL art with Codex image generation**, conditioned on the text brief PLUS those visual refs. New assets — do not ship the fable-v2 webp files as production art.
4. Implement Vite + React SPA with **imported assets** (or `import.meta.env.BASE_URL`) so `vite build --base=/main-menu/astra-v6/` never breaks paths.
5. Commit and push this branch. Write `NOTES.md`, `ART.md` / `PROVENANCE.md`.

## UX
- Left vertical button stack + living/animated right side
- Looping parchment whisper text
- Buttons: Play now (CTA), How to play, Gold Believers Campaign, Pack ripping, Settings, Mini games — extensible
- Primary CTA should read as the strongest plaque (ENTER WORLD energy)
- Mobile (~390px) AND desktop intentional
- No crypto/wallet

## Hard criteria
- No broken assets under GH Pages base `/main-menu/astra-v6/`
- Invented art only (no stock); refs are inspiration only
- Playable with `pnpm install && pnpm dev` (or npm)
