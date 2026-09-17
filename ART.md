# Clan World art pass — Imagine prompts

All plates in `public/art/` and `public/cursors/` were invented with Grok Imagine (`image_gen` / `image_edit`) for this branch. No stock photos, no Unsplash, no generic texture packs. Cambria hub screenshots in `refs/cambria/` informed card weight and contrast only — no pixels were copied.

Style contract: hand-painted 16-bit pixel art, charcoal / bronze / gold / cream / crimson, weathered clan-hall materials.

Video tools (`image_to_video`, `reference_to_video`) are blocked under this environment’s zero-data-retention setting. The living hero loop is three Imagine stills of the same camp (idle / tall-flame / smoky) compiled with ffmpeg into `hero-camp.mp4` at 5 fps.

Wordmark `public/art/wordmark.png` is retained from the first Imagine pass: lettering reads **C L A N   W O R L D** with a rune-seal above.

Processing: `scripts/process_art.py` chroma-keys the magenta field, despills hover glow, and downsamples UI plates for load.

---

## Parchment plate — `parchment.jpg` (1:1)

> Dark aged clan-vellum filling the entire square, the color of soot, oak-gall, and dried blood-brown. The fibers are stained with wine blooms, smoke, and pale salt rings, and a faint gold-ink language of bind-runes, sun-wheels, and thorn-marks is rubbed into the paper as if copied for centuries. Hand-painted 16-bit pixel-art parchment texture, even lighting, no unique landmark in the center, no modern letters, a sheet that could tile across a hall wall.

Used as a full-bleed cover (the generated plate has a manuscript vignette, so it is not tiled).

## Rune veil — `runes.jpg` (1:1)

> A dark charcoal field densely covered in glowing gold bind-runes, concentric sun-wheels, stacked diamonds, and angular clan marks, as if a shaman painted a whole wall of oaths. The marks vary in brightness — some fresh gold, some almost vanished. Hand-painted 16-bit pixel art, even scatter across the square, no readable English, no unique giant symbol, a repeating rune veil for a game menu overlay.

Overlay-blended on the parchment.

## Stage frame — `frame.png` (1:1)

> A square sandstone picture frame for a game UI, isolated on flat black. Bronze rune-plates occupy the four corners; the four edges are a uniform run of weathered stone blocks of even thickness so the frame can 9-slice. The whole center is empty black. Hand-painted 16-bit pixel art, moss in the cracks, no readable letters.

## Button idle — `btn-idle.png` (2:1)

> 16-bit pixel-art game menu button plaque, SNES RPG UI, chunky visible pixels, flat painted metal, not a 3D render and not photoreal. A wide dark-iron rectangle with a heavy gold rim, three square rivets stacked on the left edge and three on the right, a faceted gold spear-point with a tiny ruby jutting cleanly out of the left short side and a matching spear-point jutting out of the right short side. The center fill is empty dark hammered iron, ready for a title. Isolated on a flat bright magenta chroma-key field. No wooden shelf, no letters, no numbers.

States below are `image_edit`s of that idle plate. Freeze list: same shape, size, ornament, frame thickness, spear-points, rivets, magenta field.

### Hover — `btn-hover.png`

> Change ONLY the state treatment: add a soft gold outer glow around the whole plaque and slightly brighten the gold rim, rivets, and spear-points as a hover state. No letters.

### Pressed — `btn-pressed.png`

> Change ONLY the state treatment: pressed — darker iron fill, dimmer gold, a heavy inner shadow so the plate looks inset. No letters.

### Primary Play now — `btn-primary.png`

> Change ONLY the fill: replace the dark iron center with hammered bright gold so this is the primary Play-now plate, heavier and warmer. No letters.

### Primary hover — `btn-primary-hover.png`

> Change ONLY the state treatment: add a soft gold outer glow and slightly brighten the hammered gold fill as a hover state. No letters.

### Primary pressed — `btn-primary-pressed.png`

> Change ONLY the state treatment: pressed — slightly darker gold fill, a heavy inner shadow so the plate looks inset. No letters.

## Icons (1:1, magenta field)

Style contract from the hearth, then edit-chained.

### Play — `icon-play.png`

> A 16-bit pixel-art inventory icon of a stone hearth: a ring of grey river-stones, three charred logs, a tall orange-gold fire, one bright spark above. Centered with even padding, isolated on a flat bright magenta chroma-key field. Hand-painted fantasy RPG icon, warm hearth light, no letters.

### How to play — `icon-howto.png`

> Keep the exact same 16-bit pixel-art icon style, the same padding, the same magenta chroma-key field, and the same visual weight. Replace only the hearth with a rolled parchment scroll standing upright, cream paper, a crimson wax seal stamped with a gold sun-wheel in the center. No letters.

(Follow-up edit removed the drop shadow.)

### Gold Believers — `icon-gold.png`

> …Replace only the hearth with a heavy round gold coin, a chalice in relief on its face, warm hammered metal. No letters.

(Follow-up edit removed a leftover stone ring so the coin floats alone.)

### Pack ripping — `icon-pack.png`

> …Replace only the hearth with a dark-blue foil trading-pack standing upright, one top corner torn back to reveal a gold omen-star. No letters.

### Settings — `icon-settings.png`

> …Replace only the hearth with a cracked bronze cog-wheel, a thorn-shaped rune cut into the hub. No letters.

### Mini games — `icon-minigames.png`

> …Replace only the hearth with a pair of bone-white dice sitting together, pips like tiny dark runes. No letters.

(Follow-up edit removed the drop shadow.)

## Cursors (1:1, magenta field)

### Arrow — `cursors/arrow.png`

> Exactly one gold pixel-art mouse cursor and nothing else: a single classic arrow aiming at the upper-left corner of the canvas, cream highlight on the leading edge, deep bronze outline. Isolated on a flat bright magenta chroma-key field. 16-bit game HUD sprite, no second arrow, no duplicate, no extra objects, no letters.

### Pointer — `cursors/pointer.png`

> Keep the exact same 16-bit gold pixel-art HUD style, the same magenta chroma-key field, and the same tiny sprite scale. Replace only the arrow with a gold-and-bronze pointing gauntlet, index finger extended toward the upper-left, cream knuckle highlights. One gauntlet only, no extra objects, no letters.

## Living hero — `hero-camp.jpg` + `hero-camp.mp4` (16:9)

### Still

> A 16-bit pixel-art clan camp at dusk, cinematic wide shot. In the foreground a stone hearth burns; an old Ælder in a crimson robe and white fur cloak stands to the right of the fire with a raven-headed staff. To the left a timber palisade with a red bear-paw banner, a wheat-laden wagon, and two clansmen stacking sheaves. A river catches the last gold of sunset beyond the pines. Hand-painted JRPG scene, living village, no modern objects, no letters.

### Fire-flicker edits (loop frames)

> Same camp scene, same people, same tents, same river, same sky, same camera, same pixel-art style. Change ONLY the hearth fire: the flames grow taller and lean slightly to the left, a little more bright orange, a wisp of smoke higher. No letters.

> …the flames shorten and lean slightly to the right, deeper red at the base, smoke drifting right. No letters.

Compiled ping-pong: idle → tall → smoky → tall, 5 fps, 1280×720 H.264.

## Known defects

- Button idle has four rivets per short side plus an extra red gem (asked for three rivets).
- Frame corner plates mix a few Latin-looking glyphs into the runes.
- Gauntlet cursor is slightly organic at native size; it reads at 40px.
- Parchment is a vignetted manuscript plate, used as `background-size: cover` rather than a seamless tile.
- Primary pressed fill is flatter than the hammered idle gold.
- Imagine video is unavailable under ZDR; the mp4 is a still-frame loop, not a generated clip.
