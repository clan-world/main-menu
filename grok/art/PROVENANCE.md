# Clan World main-menu art

Invented with Grok Imagine for this prototype (2026-09-17 art pass). Cambria hub screenshots in `refs/cambria/` informed material, contrast, and card weight — no pixels were copied. Full prompts live in [`ART.md`](../../ART.md).

| File | Role | Source |
| --- | --- | --- |
| parchment.jpg | Aged vellum / ink-stain atmosphere plate | `image_gen` 1:1 |
| runes.jpg | Gold bind-rune veil (overlay) | `image_gen` 1:1 |
| hero-camp.jpg | Living right-side camp still | `image_gen` 16:9 |
| hero-camp.mp4 | Hearth flicker loop (5 fps, 3 Imagine frames) | `image_edit` + ffmpeg |
| wordmark.png | CLAN WORLD | First Imagine pass, lettering verified |
| btn-idle.png | Dark iron plaque | `image_gen` 2:1 |
| btn-hover.png | Same plaque, gold glow | `image_edit` of idle |
| btn-pressed.png | Same plaque, inset | `image_edit` of idle |
| btn-primary.png | Hammered gold Play-now plate | `image_edit` of idle |
| btn-primary-hover.png | Gold plate + glow | `image_edit` of primary |
| btn-primary-pressed.png | Gold plate inset | `image_edit` of primary |
| icon-play.png | Hearth | `image_gen` 1:1 |
| icon-howto.png | Sealed scroll | `image_edit` of play |
| icon-gold.png | Chalice coin | `image_edit` of play |
| icon-pack.png | Torn foil pack | `image_edit` of play |
| icon-settings.png | Rune cog | `image_edit` of play |
| icon-minigames.png | Bone dice | `image_edit` of play |
| frame.png | Stone 9-slice around the stage | `image_gen` 1:1 |

Cursors (`/public/cursors/arrow.png`, `pointer.png`) are Imagine pixel HUD sprites, magenta-keyed. Favicon is the hearth icon. Fonts are SIL OFL (Cinzel, Uncial Antiqua, Fragment Mono).
