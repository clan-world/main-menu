# Console feel — what this pass did

Not a marketing page. A hall you sit in.

- **No website chrome.** No top tabs, no “sign in”, no wallet, no footer legal. Full-viewport hub, overflow locked on desktop, boot fade from black.
- **Textured plaques, not divs.** Menu rows are generated bronze/gold plates with idle, hover, pressed, and a heavier gold primary for Play now. Icons + title + subtitle, Cambria card weight, Clan World metal.
- **Custom cursors.** Pixel gold arrow / gauntlet. The drawn cursor lerps after the pointer; click plays a short elastic squash (Mikail’s “stop treating your cursor like it’s outside the game”). Native cursor hidden while that’s on. Off by default on coarse pointers; toggle in Settings.
- **Parchment + runes.** Dark aged paper tiles behind everything, slow drift, extra rune overlay. Whisper lines type onto the stage then fade and loop.
- **Left stack, living right.** Always-on selection (keyboard or hover) drives the right stage immediately — console preview, not a click-then-navigate site. The camp Ken-burns, hearth glow pulses, embers rise. Play now flashes a “Crossing the hearth” veil.
- **Sound as chrome.** First pointer-down unlocks a low hearth drone + crackle and UI ticks. Mute lives on the dock like a game speaker glyph.
- **Mobile.** Wordmark / living stage / button stack, landscape splits like the desktop rail. Safe-area padding. Hit targets stay large.

Extensible: add a row to `src/data/menu.ts`. The rail and stage both read that list.
