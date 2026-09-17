// Every image the menu uses is imported here so Vite emits hashed URLs that are
// already prefixed with the configured `base` (GitHub Pages sub-path safe).
// Nothing in the app may reference `/art/...` or any other root path directly.
import parchmentBg from "./art/parchment-bg.webp";
import stoneChrome from "./art/stone-chrome.webp";
import heroScene from "./art/hero-scene.webp";
import platePrimary from "./art/plate-primary.webp";
import plateSecondary from "./art/plate-secondary.webp";
import runeRing from "./art/rune-ring.webp";
import crest from "./art/crest.webp";
import wordmark from "./art/wordmark.webp";
import cornerOrnament from "./art/corner-ornament.webp";
import waxSeal from "./art/wax-seal.webp";
import iconPlay from "./art/icon-play.webp";
import iconHowto from "./art/icon-howto.webp";
import iconGold from "./art/icon-gold.webp";
import iconPacks from "./art/icon-packs.webp";
import iconSettings from "./art/icon-settings.webp";
import iconMinigames from "./art/icon-minigames.webp";
import cursorArrow from "./art/cursor-arrow.png";
import cursorHand from "./art/cursor-hand.png";
import cursorMeta from "./art/meta.json";

export const art = {
  parchmentBg,
  stoneChrome,
  heroScene,
  platePrimary,
  plateSecondary,
  runeRing,
  crest,
  wordmark,
  cornerOrnament,
  waxSeal,
  cursorArrow,
  cursorHand,
} as const;

export const icons = {
  play: iconPlay,
  howto: iconHowto,
  gold: iconGold,
  packs: iconPacks,
  settings: iconSettings,
  minigames: iconMinigames,
} as const;

export type IconKey = keyof typeof icons;

type Hotspot = { hotspot: [number, number] | null };
const meta = cursorMeta as unknown as Record<string, Hotspot>;
const hs = (k: string, fallback: [number, number]) => meta[k]?.hotspot ?? fallback;

/** CSS custom properties consumed by styles.css (backgrounds, plates, cursors). */
export const artVars: Record<string, string> = {
  "--img-parchment": `url("${parchmentBg}")`,
  "--img-stone": `url("${stoneChrome}")`,
  "--img-plate-primary": `url("${platePrimary}")`,
  "--img-plate-secondary": `url("${plateSecondary}")`,
  "--img-corner": `url("${cornerOrnament}")`,
  "--cursor-arrow": `url("${cursorArrow}") ${hs("cursor-arrow", [2, 2]).join(" ")}, auto`,
  "--cursor-hand": `url("${cursorHand}") ${hs("cursor-hand", [14, 2]).join(" ")}, pointer`,
};

/** Sanity check used by the dev overlay / tests: BASE_URL must be honoured. */
export const baseUrl = import.meta.env.BASE_URL;
