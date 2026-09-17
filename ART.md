# ART.md — provenance of every visual on `prototype/fable-5-1`

Everything you see in the menu is invented for Clan World with image generation. No stock photos, no
texture packs, no Unsplash, no procedural noise. This file lists each asset, the exact prompt that made
it, and how it was turned into a runtime file. `tools/art_prompts.json` holds the same prompts in
machine-readable form so the set can be regenerated.

## Pipeline

Claude Code has no image generator of its own, so this branch drives the two generators that are
installed and signed in on the build box, non-interactively:

| Step | Tool | Command |
| --- | --- | --- |
| Generate raw art | OpenAI Codex CLI, built-in `image_gen` tool (gpt-image) | `python3 tools/gen_art.py` → `codex exec … "Use the built-in image_gen tool…"` |
| Hover / pressed variants | Codex `image_gen` in edit mode with the idle plaque attached | `codex exec -i plaque_idle.png plaque_primary.png - < prompt.txt` |
| Hero loop video | Grok Build CLI, `image_to_video` (Grok Imagine) | `grok -p "Use your image_to_video tool on hero.png…"` |
| Crop / slice / optimise | Pillow | `RAW=/tmp/cw-art/raw python3 tools/build_assets.py` → `public/art/` |

The Grok Imagine video call was attempted and **refused by the account's zero-data-retention policy**
(`image_to_video` returns a ZDR error; image generation on that CLI is gated the same way). The hero is
therefore the generated painting under an animated canvas layer (see "Living hero plate" below) rather
than a video. The `tools/gen_art.py` script and the prompt below are ready for the day the video tool is
allowed.

Raw generations are 1024–2172 px PNGs; runtime assets are WebP (alpha sprites), JPEG (plates) and PNG
(cursors, which browsers require). Total `public/art/` is about 1.4 MB.

## Assets and prompts

### Parchment / runes background plate — `public/art/parchment.jpg`

> Full-bleed painted texture plate for a dark-fantasy game main menu background: an ancient sheet of vellum parchment filling the entire frame edge to edge, seen straight on. Warm ochre and tan with darker burnt-umber scorched edges and corners, visible fibre grain, soft creases, a few faint sepia water rings and ink blots. Scattered sparsely across it, faded hand-inked Elder-Futhark-style runes in dark sepia at very low opacity, as if written centuries ago and worn away. Slightly brighter, cleaner area centre-right where a picture frame will sit. Painterly, high detail, evenly lit, no letters or words, no borders, no logos, no objects.

Used as the stage background (`.parchment`), behind the scroll panel, and at 10% under the boot splash.
`public/art/fibre.png` is a high-pass filter of this same image, mirror-tiled, used as the moving grain
overlay, so even the "film grain" is the parchment's own fibre.

### Chrome bar wood — `public/art/wood.jpg`

> Seamless tileable texture of very dark aged oak wood planks with fine straight grain, stained almost black-brown with warm mahogany highlights, faint scratches and a subtle oiled sheen, used as the chrome bars of a medieval game console UI. Evenly lit, no seams, no nails, no text, no borders, tileable.

Made truly seamless by mirror-tiling a 512 px crop (2×2 with flips) in `build_assets.py`. Top bar,
hint bar, Back / ghost buttons.

### Button plaques — `public/art/plaque-*.webp`

Idle:

> Isolated game-UI menu button plaque on a fully transparent background, centred, filling the frame width: a long horizontal rectangular plate of dark stained oak wood and worn black leather, framed by a hand-forged bronze border with hammered texture, four riveted bronze corner brackets with small scroll flourishes, a thin inner gold hairline inset from the border, and a slight dark inner shadow along the bottom edge. Aspect about 6:1 wide. Dark fantasy Viking-Celtic style, painterly but crisp edges, front view, no perspective, no text, no icons, no glow, the centre area plain and empty for a label.

Primary (Play now):

> Isolated game-UI primary call-to-action button plaque on a fully transparent background, centred, filling the frame width: a long horizontal rectangular plate of deep crimson red tooled leather with subtle diamond stitching, framed by a rich hand-forged polished gold border with hammered texture, four ornate gold corner brackets with Celtic knot flourishes and rivets, a thin inner brighter gold hairline, subtle warm light catching the top edge. Aspect about 6:1 wide. Dark fantasy Viking-Celtic style, painterly but crisp edges, front view, no perspective, no text, no icons, the centre area plain and empty for a label.

Hover and pressed states were made by *editing* the idle images in the same Codex session so geometry
stays identical and the states can be crossfaded:

> 1. HOVER variant of image 1: the bronze frame becomes bright polished gold catching light, a soft warm gold glow along the inner hairline, the leather centre slightly warmer and lit from the top edge.
> 2. PRESSED variant of image 1: everything darker and pushed in: the frame dimmer bronze, a strong dark inner shadow along the top and left inside edge, the leather centre darkened as if in shade.
> 3. HOVER variant of image 2: the gold frame blazing brighter with a warm glow along the inner hairline and the crimson leather lit warmer from the top.

All five are cropped to the idle plaque's alpha bounding box and applied with CSS `border-image`
(slices 30%/9% for bronze, 34%/11% for gold), so the forged corner brackets never stretch; only the
rails and leather between them do. The three states are stacked `.skin` layers crossfaded by opacity.
The primary pressed state is the primary plaque darkened with a CSS filter.

### Menu icons — `public/art/icons/*.webp`

One sprite sheet, sliced into six 144 px sprites by `build_assets.py`:

> Sprite sheet of six game menu icons arranged in an exact 3 columns by 2 rows grid with equal spacing on a fully transparent background, each icon the same size and centred in its cell. All icons in the same style: embossed antique gold metal with bronze shadows and a subtle dark outline, dark fantasy Viking-Celtic game UI, front view, no cell borders, no text. Row 1: (1) a crossed pair of longswords, (2) an unrolled parchment scroll with a wax seal, (3) a radiant sun disc with a shield in the centre. Row 2: (4) a fanned hand of three ornate playing cards with a torn wax seal, (5) an iron cog gear, (6) a pair of carved bone dice showing pips.

Mapping: sword → Play now, scroll → How to play, sun → Gold Believers Campaign, cards → Pack ripping,
cog → Settings, dice → Mini games (`src/components/ArtIcon.jsx`). The small chevron, speaker and
fullscreen glyphs remain inline SVG.

### Cursors — `public/art/cursors/*.png` (+ `@2x`)

One 2×2 sheet, sliced and fitted to 36 px (72 px retina):

> Sprite sheet of four game cursor icons arranged in an exact 2 by 2 grid on a fully transparent background, each large and centred in its cell, same style: dark fantasy Viking-Celtic game UI, black iron with polished gold edges and a subtle bronze bevel, crisp readable silhouettes. Top-left: a classic pointer arrow shaped like a dagger blade, tip at the upper-left, pointing up-left. Top-right: a small ornate short sword pointing up-left, gold crossguard, the tip at the upper-left. Bottom-left: an armoured gauntlet open hand, palm out. Bottom-right: an armoured gauntlet closed fist gripping. No text, no cell borders, no shadows on the background.

`arrow` is the default cursor (hotspot 2,2), `pointer` the sword for anything clickable (2,2), `grab` /
`grabbing` the gauntlets over the menu column. Declared with `image-set()` for retina where supported.

### Living hero plate — `public/art/hero.jpg`

> Painterly dark-fantasy game key art, wide 3:2 landscape: a clan war camp at night on a high moor. In the left third a tall crimson clan banner with a gold border and a black shield emblem showing a gold tower and three stars hangs from a wooden pole and stirs in the wind. Bottom right a campfire burns with warm orange light and drifting embers, lighting the ground and the faces of three armoured warriors sitting and standing around it seen from behind, small in frame. Behind them layered misty mountain ridges recede into a deep blue night sky with a large pale moon top right and scattered stars, thin fog banks on the moor. Moody, cinematic, rich detail, oil-painting texture, no text, no letters, no logos, no UI.

The painting is an `<img>` inside `.hero-media`, which drifts on a 46 s push-in. `src/scene/HeroScene.jsx`
draws a transparent canvas over it, mapped to the painting's `object-fit: cover` geometry: the campfire
breathes (additive flicker), embers rise from the fire, fog rolls across the moor, stars twinkle, the moon
halo pulses and a band of light travels across the banner cloth. Reduced-motion users get a single
static frame.

Intended video loop (blocked by ZDR, see above):

> Subtle living painting loop: the crimson banner ripples gently in the wind, the campfire flames flicker and embers drift upward, thin fog slowly rolls across the moor, stars twinkle, the camera holds perfectly still with no zoom, no pan, no new objects, no people moving, seamless calm ambient motion.

### Crest — `public/art/crest.webp`

> Isolated game emblem on a fully transparent background, centred: a round bronze medallion with a hammered rim and a ring of tiny engraved runes, containing a black heraldic shield bearing a gold tower and three small gold stars, dark fantasy Viking-Celtic game UI, embossed antique gold and bronze, crisp, front view, no text.

Top bar crest and boot splash emblem. It matches the banner in the hero painting on purpose (same
tower-and-three-stars device).

### Play medallion — `public/art/medallion-play.webp`

> Isolated round game play button on a fully transparent background, centred: a thick polished gold medallion with a hammered bronze outer ring engraved with tiny runes, a dark glossy obsidian centre, and a large bright gold triangular play arrow pointing right embossed in the middle. Dark fantasy Viking-Celtic game UI, crisp, front view, no text.

The play affordance in the middle of the hero.

## Still code-drawn (by design)

- Rune field on the parchment (`RuneField.jsx`) and the splash rune ring: strokes from `src/lib/runes.js`,
  drawn live so individual runes can glint.
- Whisper ink text, hint-bar keycaps, the scroll panel's rollers, and the small utility glyphs.
- Sound is synthesised in `src/lib/sound.js`.

## Regenerating

```bash
# needs the Codex CLI signed in on this machine
python3 tools/gen_art.py                     # all assets → /tmp/cw-art/raw
python3 tools/gen_art.py hero cursors        # just some
RAW=/tmp/cw-art/raw python3 tools/build_assets.py   # → public/art
```
