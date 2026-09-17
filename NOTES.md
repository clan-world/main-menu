# NOTES — console feel, what was done and why

Goal: the browser should feel like a game hub you booted into, not a page you loaded. Every choice below is in service of that. Reference direction was the Cambria.gg hub (card-like nav with icon + caption, gold/red on charcoal, hero on the right) re-skinned as Clan World parchment and runes.

## Structure that reads as "console"

- **Boot splash.** Gold-gradient wordmark over a slowly turning rune ring, "Press any key / Tap to enter". The gesture is also what unlocks WebAudio, so the ambience starts exactly when the menu appears instead of being blocked by autoplay rules.
- **Fixed stage, no scroll.** The whole app is `position: fixed` with `overflow: hidden`, `user-select: none`, right-click and drag disabled, `overscroll-behavior: none`. Nothing rubber-bands or highlights like a document.
- **Chrome bars.** Top bar (crest, wordmark, player plate with avatar and gold, mute, fullscreen) and bottom hint bar (`↵ Select · Esc Back · ↑↓ Navigate`) on wood texture with a bronze rule and a gold hairline. The hint bar swaps to `A` / `B` pad glyphs when a gamepad is used.
- **Always one item selected.** Console menus never have "nothing focused". A gold rune marker slides between rows, and keyboard, mouse hover and gamepad all drive the same selection state.
- **Gamepad support** through the Gamepad API: d-pad or stick to move (with key repeat), `A` confirm, `B` back.
- **Transitions.** Rows slide in staggered on boot, the hero scales in, panels unroll like a scroll, and "Play now" cuts to a black "Entering the realm" screen with a fill bar and a loading tip before returning.

## Buttons that are not divs

Each button is a stack of layers, all in `src/components/MenuButton.jsx` + `styles.css`:

- Dark wood base texture plus a grit overlay and a diagonal leather sheen.
- Bronze double frame (border plus inset gold hairline plus a deep inner shadow at the bottom edge) and four SVG corner flourishes with rivets.
- A round bronze medallion for the icon with a slowly rotating dashed ring. The ring spins faster and turns gold on selection.
- Cinzel uppercase label, IM Fell italic subtitle, optional pulsing `LIVE` badge, and a chevron that slides right on selection.
- Selection state: gold rim glow, a light sweep across the face, slight scale and translate. Press state compresses the frame.
- **Play now** is a crimson leather variant with a solid-gold medallion, larger size and a breathing glow so the CTA always has the most weight.
- Sizes are `clamp()`-ed against viewport height so the six-row stack always fits above the hint bar on short laptop screens.

## Custom cursors

Three hand-drawn SVG cursors in `public/cursors/`: a dark, gold-edged blade arrow for the default, a small sword for anything clickable, and a ring reticle spare. They are applied via CSS with correct hotspots and fall back to the native cursors if SVG cursors are unsupported.

## Living right side

`src/scene/HeroScene.jsx` is a canvas painting with no image assets:

- Night sky gradient, ninety twinkling stars, a cratered moon with halo.
- Three mountain ridges built from summed sines so they wrap seamlessly, drifting at different speeds for parallax.
- A campfire at the bottom right: flickering radial glow driven by layered sines, seven animated flame tongues, and forty-six embers that rise, sway and fade.
- Drifting fog bands and a foreground ground silhouette.
- A **waving clan banner**: the cloth (crimson, gold border, rune ring, shield with tower and stars, "CLAN WORLD" ribbon) is painted once to an offscreen canvas, then drawn in 3px vertical strips with a travelling sine offset and per-strip light/shade so it reads as cloth in wind.
- DOM plates on top: season title, a rotating live counter (warriors awake / clans mustered / packs ripped), a ticking campaign countdown, and a caption that changes with the selected menu item. A pulsing play medallion sits in the middle of the scene.

The scene pauses while a panel is open and honours reduced motion (also a toggle in Settings).

## Parchment and runes

- `tools/make_textures.py` bakes the parchment (fractal noise tone map, fibre streaks, creases, stains, burnt vignette), a tileable dark wood, and a transparent grit tile with Pillow, so the art is reproducible and stays small.
- `src/components/RuneField.jsx` inks a sparse field of Elder-Futhark-style glyphs (defined as line segments in `src/lib/runes.js`, no rune font needed) across the parchment at 5–12% opacity. Every second or two one rune catches candlelight: a gold glow that swells and fades.
- A moving grain layer in multiply blend gives the paper a faint film-like shimmer.

## Whisper text

`src/components/Whisper.jsx` cycles through the lines in `src/menu.js`. Each character animates in with a blur-to-sharp "ink soaking in" curve, staggered by 38ms, holds for about three seconds, then the whole line bleeds out (blur, lighten, drift up). Lines alternate between left, centre and right slots of the band under the stage, with a slight tilt so they never look typeset.

## Sound

`src/lib/sound.js` synthesises everything with WebAudio: hover tick, confirm chord, back tone, a small brass fanfare for Play now, a boot swell, and a looped ambience (brown noise through a slowly modulated low-pass filter plus a 55Hz hum). Mute in the top bar, `M`, or Settings. No audio files are shipped.

## Mobile

Under 880px the hero moves above the stack as a shorter framed window, the six rows tighten so they fit a 390×844 phone without scrolling, hover transforms are dropped in favour of the glow, the hint bar is hidden, and the splash says "Tap to enter". Safe-area insets are respected.

## Not done / next

- Placeholder panels only; real routes would replace `Panel` content.
- A short pixel-art or painted character on the right would push closer to Cambria's hero. The canvas scene is built to accept another layer.
- Haptics on gamepad, and an idle "attract" mode after inactivity.
