# Clan World generated art pass

Created September 17, 2026 with the built-in image_gen tool (no stock, texture packs, or external image sources). Cambria was a layout reference only; none of its pixels ship. All runtime images are in this directory. Fonts remain bundled under their existing SIL licenses.

## Shipped assets

- paper.webp: generated parchment and rune background, also used in dialogs.
- hero.webp: newly generated sanctuary plate. A 10-second CSS drift loop animates this painting; generated crystal sprites rise on separate loops. The existing motion setting and system reduced-motion preference stop these animations. Imagine/video generation was not available in this toolset, so no video or generated temporal frames are claimed.
- plaque-idle.webp, plaque-hover.webp, plaque-pressed.webp: separately generated, aligned ornamented bronze interaction states. Keyboard focus uses hover art; activation uses pressed art.
- plaque-primary.webp: generated gold Play now plaque; brightness and movement provide its hover/pressed feedback while preserving its gold identity.
- icon-{sword,book,sun,cards,gear,dice,sound,ember}.webp: individually exported generated relic atlas sprites; also reused in panel headers, pack reveals, profile and hero marker.
- cursor.png, pointer.png: generated arrow and gauntlet, exported at 32 × 32 with alpha. CSS hotspots: arrow (5,1), gauntlet (4,1). Native fallbacks remain available.

All lettering, accessibility labels, navigation arrows and game rune puzzle characters remain live text. CSS handles layout, focus rings, compositing, shadows and motion; it does not generate material textures. The old procedural SVG grain, SVG cursors, path icons and gradient material surfaces have been removed.

## Production export

The generated PNG originals remain in the image tool session directory. generation.json records their filenames and exact prompts. The exported WebP/PNG files committed here are sufficient to run the app, with no dependency on that directory or image tooling. scripts/export-art.cjs documents reproducible crop, sprite separation and compression using Sharp 0.35.4 (an export-only dependency, not an app dependency).

Plaques use the same source crop (22,312,1493,362) resized to 900 × 218. Atlas sprites are separated by alpha-connected silhouettes to avoid including neighboring icons; 128 × 128 WebP exports retain alpha. Cursor exports are 32 × 32 PNG. Parchment and hero are 1536 × 1024 WebP at quality 85; plaques use quality 88. Total runtime artwork is approximately 1.1 MiB. No new imagery is synthesized by the export script.

To repeat exports with the original PNGs and Sharp available:

```sh
NODE_PATH=/path/to/node_modules node scripts/export-art.cjs /path/to/generated_images/session
```

## Exact generation prompts

Idle plaque was the edit target for hover, pressed and primary variants; other requests were new generation without reference image input.

### paper

Source: `exec-dfd30808-b739-4d89-8aa6-2eeb112fd902.png`

Use case: stylized-concept. Asset type: full bleed background parchment plate for Clan World fantasy game menu. Landscape 1536x1024. Invent an ancient warm ivory vellum manuscript, tactile handmade fibers, softly worn sepia edges, exquisitely hand inked small runic inscriptions and fragments of astronomical rings confined to the outermost edges. Large quiet pale center and left for UI readability. Muted moss, antique gold and walnut ink. Hand painted RPG illuminated atlas aesthetic, no recognizable words, no UI, no photographic stock texture, no watermark. Entire canvas is parchment, no outside background.

### hero

Source: `exec-95c259fb-f107-45ad-9a9e-f5cec048dfa7.png`

Use case: stylized-concept. Asset type: Clan World living right-side hero plate, landscape 1536x1024. Original handcrafted fantasy illuminated atlas painting: an ancient clan sanctuary on a floating rocky island, circular stone gateway with amber light at center, cypress trees, mossy steps, russet-roof towers, small red pennants, little warm lanterns, slender waterfalls fading into ink-wash mist. Island framed by incomplete hand-inked astronomical rings and subtle invented runes. Rich painterly gouache and meticulous pen hatching, moss green, bronze, warm ivory vellum. Center the island, occupy middle 80 percent, edges dissolve softly into pale parchment. Leave bottom 15 percent quiet pale parchment for live caption. No text, UI, watermark, stock imagery. Atmospheric narrative, premium fantasy strategy game.

### idle

Source: `exec-4de7eb47-9d11-4943-9d0b-fc6ec3c66304.png`

Use case: stylized-concept. Asset type: one blank idle button plaque for Clan World fantasy game, wide landscape 1536x1024 canvas. A single long horizontal rectangular plaque, aspect ratio 5:1, centered on plain ivory background. Straight-on orthographic. Dark moss-black hammered bronze inset face, engraved antique gold double rim, ornate restrained interlaced root motifs at both short ends, tiny rivets, hand-carved irregularities. Broad empty dark central area for HTML label, no icons or lettering. Plaque occupies full canvas width with 4 percent margin on each side; approximately 28 percent canvas height. Crisp silhouette, square beveled corners. Beautiful hand painted game inventory art, matte tactile finish. No shadow outside plaque, no UI mockup, no watermark.

### hover

Source: `exec-ae0bde00-20ee-4951-80fd-cc7bb73590ca.png`

Use case: precise-object-edit. This image is the edit target: Clan World idle menu plaque. Create its HOVER state. Preserve EXACT plaque silhouette, position, size, central empty face, interlaced branch carvings and plain ivory surrounding canvas. Change only illumination: antique gold rim and branch tips shine amber, tiny engraved grooves carry restrained golden light, central moss bronze face slightly lighter. No text or new objects. Same straight-on camera.

### pressed

Source: `exec-5fb69e67-18a5-433f-ab82-858818bed19a.png`

Use case: precise-object-edit. Input image is Clan World idle plaque edit target. Create its PRESSED state, preserve EXACT silhouette, placement, dimensions, root ornament design and ivory surrounding background. Change only material lighting: inset dark bronze face appears deeply recessed, upper inside bevel strongly shadowed, lower brass lip catches narrow warm reflected light, branches dark antique bronze. No text, symbols or new objects. Same straight-on view.

### primary

Source: `exec-c50d7ea8-0d9b-4623-a544-e5ca950fa26a.png`

Use case: precise-object-edit. Input image is Clan World idle plaque edit target. Create primary PLAY NOW button plaque, with NO lettering (live text added later). Preserve EXACT silhouette, position, size and interlaced root carvings and ivory surrounding canvas. Replace dark bronze center with radiant matte hammered antique gold, warm honey gold face with subtle artisan tool marks. Dark bronze root ornaments frame gold center; gold double bevel. Center must remain quiet and clear for dark text. Same straight-on view. No icons, text or new objects.

### icons

Source: `exec-cd8acf53-579b-4b96-b57a-c4cf6840d4c8.png`

Use case: stylized-concept. Asset type: Clan World game menu icon atlas. A precise 4 columns by 2 rows grid of EIGHT separate hand-painted inventory icons on genuinely TRANSPARENT background, square 1024x1024 canvas. Each icon centered in its own equal 256x512 cell with generous transparent spacing, no dividers, no labels. Reading order: 1 diagonal ancient steel sword with bronze root hilt; 2 open vellum rune codex; 3 antique gold sun medallion; 4 three stacked moss-green sealed collectible cards; 5 ornate bronze cog; 6 ivory gaming dice pair; 7 curled bronze signal horn; 8 amber crystal ember. Strong crisp silhouettes readable at 32px. Cohesive premium painterly RPG relic art, dark outlines, warm brass edges, ivory highlights, moss enamel, tactile carved details. No text, no shadows beyond objects, no UI, no watermark. Alpha transparency.

### cursors

Source: `exec-5a879628-3718-4175-9e40-2b8941b0facd.png`

Use case: stylized-concept. Asset type: custom cursor atlas for Clan World fantasy game. Two separate cursor designs side by side on genuinely TRANSPARENT 1024x1024 canvas, each centered within its own half. Left: classic mouse arrow pointer pointing upper left, ivory steel triangular blade with dark bronze outline and tiny root-engraved gold inset, sharp tip, strong simple readable silhouette. Right: pointing armored gauntlet hand, index finger pointing upper left, bronze plates and ivory fingertip, strong simple silhouette. Painted premium fantasy game art, dark edge contrast, no extra ornaments outside silhouette. Each occupies central 60 percent of its half, ample transparent margins. Designed to be legible when reduced to 32x32. No text, no labels, no watermark, real alpha background.
