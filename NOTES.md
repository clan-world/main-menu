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

Each button is a generated plaque, not CSS chrome (`src/components/MenuButton.jsx` + `styles.css`, prompts in `ART.md`):

- Three generated skins per button (idle, hover, pressed) painted as one image and edited into states so the geometry matches; they are stacked and crossfaded with opacity.
- Applied with CSS `border-image`, so the forged corner brackets keep their shape while the rails and leather stretch to any width. `--bh` (plaque height) drives the slice widths.
- A generated embossed-gold icon per entry (crossed swords, scroll, sun-shield, cards, cog, dice) with a slowly rotating dashed ring that turns gold on selection.
- Cinzel uppercase label, IM Fell italic subtitle, a `LIVE` wax-seal badge pinned to the top rail, and a chevron that slides right on selection.
- Selection: hover skin fades in, warm drop-shadow glow, a light sweep across the face, slight scale and translate. Press swaps to the pressed skin.
- **Play now** is the crimson-leather, gold-knotwork plaque, larger, with a breathing glow so the CTA always has the most weight.
- Sizes are `clamp()`-ed against viewport height so the six-row stack always fits above the hint bar on short laptop screens.

## Custom cursors

Four generated iron-and-gold cursors in `public/art/cursors/`: a dagger-blade arrow for the default, an ornate short sword for anything clickable, and open / closed gauntlets over the menu column. 36 px with 72 px retina variants via `image-set()`, hotspots at the blade tips, native cursors as fallback.

## Living right side

A generated key-art painting (night war camp: clan banner, campfire, warriors, moonlit mountains) under a live canvas layer, `src/scene/HeroScene.jsx`:

- The painting drifts on a slow 46 s push-in so it never reads as a still.
- The canvas is mapped to the painting's `object-fit: cover` geometry so effects land on the right pixels: the campfire breathes (additive flicker), embers rise from it, fog rolls across the moor, stars twinkle, the moon halo pulses, and a band of light travels across the banner cloth.
- DOM plates on top: season title, a rotating live counter, a ticking campaign countdown, a caption that changes with the selected menu item, and the generated gold play medallion with a ripple.
- A Grok Imagine video loop of the same painting was attempted and is blocked by the account's zero-data-retention setting; the prompt is kept in `ART.md`.

The scene pauses while a panel is open and honours reduced motion (also a toggle in Settings).

## Parchment and runes

- The background is a generated vellum plate with scorched edges, stains and faded inked runes (`public/art/parchment.jpg`, prompt in `ART.md`). Chrome bars use a generated dark-oak plank texture made seamless by mirror-tiling.
- `src/components/RuneField.jsx` inks a second, sparser layer of Elder-Futhark-style glyphs (line segments in `src/lib/runes.js`) on top so individual runes can catch candlelight: a gold glow that swells and fades every second or two.
- The moving grain layer is a high-pass of the generated parchment itself (`fibre.png`), so the shimmer is the paper's own fibre.

## Whisper text

`src/components/Whisper.jsx` cycles through the lines in `src/menu.js`. Each character animates in with a blur-to-sharp "ink soaking in" curve, staggered by 38ms, holds for about three seconds, then the whole line bleeds out (blur, lighten, drift up). Lines alternate between left, centre and right slots of the band under the stage, with a slight tilt so they never look typeset.

## Sound

`src/lib/sound.js` synthesises everything with WebAudio: hover tick, confirm chord, back tone, a small brass fanfare for Play now, a boot swell, and a looped ambience (brown noise through a slowly modulated low-pass filter plus a 55Hz hum). Mute in the top bar, `M`, or Settings. No audio files are shipped.

## Mobile

Under 880px the hero moves above the stack as a shorter framed window, the six rows tighten so they fit a 390×844 phone without scrolling, hover transforms are dropped in favour of the glow, the hint bar is hidden, and the splash says "Tap to enter". Safe-area insets are respected.

## Not done / next

- Placeholder panels only; real routes would replace `Panel` content.
- A real video loop of the hero once Grok Imagine is allowed on this account; `HeroPanel` only needs a `<video>` in place of the `<img>`.
- Haptics on gamepad, and an idle "attract" mode after inactivity.
