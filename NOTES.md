# Astra v6 implementation notes

## Design

The Cambria screenshots informed the weighted left navigation, companion captions, persistent chrome, and keyboard-first hub behavior. The Fable v2 live preview was inspected in a browser, including its title screen and main menu; its code was not read or copied. Its paper-and-paint integration informed the composition.

The supplied ENTER WORLD plaque sets the button language: green stone-jade, a chunky bevel, cream lettering, and pointed gold star end-caps. A newly generated blank plaque supplies the body of every control. Secondary buttons use the same original asset with a muted finish, allowing the bright primary button to stand out.

The Verdant Gate is a fresh generated painting with a valley, waterfalls, travelers, a wolf, and olive banners. The paper edge fades into the hub rather than appearing as a rectangular card. Generated fire motes drift across the scene; the painting breathes slowly and the gate light pulses. Whisper text cycles every 6.5 seconds. Motion can be disabled, and system reduced motion wins over animation styles.

The mobile layout puts a cropped world view first, then a compact wordmark and a generous vertical menu. It intentionally scrolls on a 390×844 phone instead of shrinking hit targets. Desktop shows all six menu choices and a persistent scene.

## Implementation

Vite + React, local assets, system serif fonts, no runtime network dependency. The data-driven `entries` array is the extension point for further menu entries. Native modal dialogs provide modal focus containment; Escape closes and returns focus. Menu sounds are synthesized with Web Audio rather than downloaded recordings.

The scene, paper, plaque, icons, cursor, crest, and particles were invented using the built-in Codex image generation tool. Sharp only crops, trims, scales, and compresses that output. Production art totals approximately 1 MB. No reference asset is imported by the application.

## Validation

Production built with `vite build --base=/main-menu/astra-v6/`. Browser tests cover the actual prefixed preview path, missing assets/runtime errors, all six panels, keyboard navigation, journey return, pack opening, ten successful Rune Hunt selections, persistent settings, and responsive overflow. Visual screenshots are saved at 1440×960 and 390×844.

## Scope

This is a local interactive menu prototype. The world journey and Gold Believers Campaign are story previews. Pack results are illustrative and reset when the page reloads. Rune Hunt is playable. No server state, live player counts, accounts, purchases, or crypto/wallet features are implied.
