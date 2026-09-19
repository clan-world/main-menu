# Original art / provenance

All production bitmap assets were generated for this branch with the **built-in Codex image generation tool** on 2026-09-19. No stock art or Fable v2 file is shipped as production art. References remain in `refs/` for audit only and are excluded from the Vite output.

## Outputs

| Generated output | Production files | Reference inputs |
| --- | --- | --- |
| `exec-0408bc14-04ac-446e-8142-4516d5d57d96.png` | `src/assets/verdant-gate.webp` | Fable hero and parchment, inspiration |
| `exec-a361de21-7b7a-4423-b69a-da1784f5b6d2.png` | `src/assets/jade-plaque.webp` | ENTER WORLD plaque and Fable primary plate, style only |
| `exec-f9effbc7-fae1-43af-959b-37d0e4a2de31.png` | `src/assets/parchment.webp` | Fable parchment and stone chrome, material inspiration |
| `exec-1cd4899b-3764-42e6-bc40-74ff2b256f66.png` | `src/assets/{sword,scroll,sun,pack,cog,dice,crest,cursor,mote}.webp`, `cursor.png` | Text prompt only |

Original generation directory in the authoring environment: `/home/box/.codex/generated_images/01a0bae8-88f2-7b83-b1fb-a8f431b68ef0/`. The application only needs the committed optimized assets. `scripts/prepare-art.mjs <original-directory/>` records the deterministic export process: alpha-preserving trim, sprite extraction, resize, WebP conversion, and a 32px PNG cursor. No hand-painted or stock replacement imagery was introduced. CSS adds compositing, light, motion, and button finish changes; text remains accessible HTML.

## Final prompt set

### World painting

Use case: stylized-concept. Create ORIGINAL production background art for Clan World fantasy console main menu, landscape 1536x1024. References are mood inspiration only, never reproduce composition. A hand-painted richly detailed storybook oil illustration of THE VERDANT GATE: enormous circular ancient stone gateway with green-gold light at center right, high on a grassy cliff overlooking misty evergreen valley, distant medieval settlement and waterfalls, warm late afternoon sunlight, two tiny cloaked travelers and a wolf on the ascending path at lower right, tattered olive banners. Layered depth, moss-covered stone, painterly brush strokes, romantic old fantasy game manual aesthetic. Gateway centered at 65 percent width, 45 percent height. World fills right 85 percent; left 15 percent softly dissolves into warm pale parchment fibers with faint invented runes, irregular painted edge, not rectangular frame. Strong forest green, muted teal shadows, antique gold, cream highlights. No text, UI, logos, icons or watermarks. New scene, not reference reproduction. Save image asset.

### Plaque

Use case: stylized-concept. Generate a single original game UI button asset on genuinely transparent background. Wide horizontal plaque, aspect ratio about 5:1 within a landscape canvas; tightly framed with small margins. Follow first reference button language closely: moss/olive green beveled stone-jade body, broad clean empty center to overlay cream typography in code, bright metallic antique gold trim and large pointed four-point star end caps left and right. Slight worn chipping, crafted chunky bevels, lovely illuminated upper rim and shadowed bottom bevel, warm golden highlights. More restrained than second reference, no colored gemstones, no busy braids. Center has NO TEXT, no symbols, no lettering, no icons. Orthographic frontal symmetric view. A premium fantasy RPG console button, original recreation of reference energy. Genuine transparent background, no checkerboard drawn, no backdrop.

### Parchment

Use case: stylized-concept. Original game UI background texture, full canvas 1536x1024. Old ivory flax parchment, subdued pale warm cream ochre, delicate genuine organic paper fibers and rubbed scuffs, very faint invented runic inscriptions along left and right edges, faint ghost of an ancient compass circle in lower left. Calm spacious center, low contrast suitable for readable dark brown typography. Thin dark worn bronze-bound edge at very top and bottom only, deeply engraved little decorative runes on the binding. This is a premium old fantasy storybook endpaper, not yellow burnt paper. Reference images are material inspiration only, invent fresh texture and motifs. No legible text, no words, no illustrations, no buttons, no watermark.

### UI sprite sheet

Use case: stylized-concept. Original fantasy game UI sprite sheet on genuinely transparent background, 1024x1024 square, strictly 3 columns by 3 rows equal cells, each object centered within its own cell with generous transparent spacing. Nine hand-painted bronze and antique gold objects in matching refined medieval storybook game style, detailed but clean silhouettes. Row 1: upright sword with olive hilt; rolled parchment scroll; golden sun medallion. Row 2: sealed olive leather card pack; bronze settings cog; pair of ivory dice. Row 3: elaborate heraldic stag antler crest with central emerald diamond (no shield); ornate small golden mouse pointer arrow pointing upper left; one tiny golden glowing fire mote. No text, no labels, no background, no grid lines, no shadows outside objects. Crisp premium game inventory illustration, genuine transparent alpha.
