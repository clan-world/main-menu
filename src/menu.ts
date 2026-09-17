import type { IconKey } from "./assets";

export type MenuItem = {
  id: string;
  label: string;
  caption: string;
  icon: IconKey;
  primary?: boolean;
  badge?: string;
  /** Placeholder copy shown in the scroll panel when the item is selected. */
  blurb: string;
};

// Order is the order on screen. Add entries here to extend the menu; the layout
// (desktop column and mobile list) scales with the array length.
export const MENU: MenuItem[] = [
  {
    id: "play",
    label: "Play now",
    caption: "Enter the world · Season I",
    icon: "play",
    primary: true,
    blurb:
      "The gate is lit. Your clan holds the northern ridge and the runes are warm. In the full build this drops you straight into the last camp you left.",
  },
  {
    id: "howto",
    label: "How to play",
    caption: "Runes, raids & rules",
    icon: "howto",
    blurb:
      "A short illustrated scroll: claim land, bind runes, raise a clan, raid at dusk. Five pages, skippable, remembers where you stopped.",
  },
  {
    id: "gold",
    label: "Gold Believers Campaign",
    caption: "Faction story · new chapter",
    icon: "gold",
    badge: "NEW",
    blurb:
      "The Believers say the gold under the gate is alive. Chapter III opens the vaults. Campaign progress and rewards live here.",
  },
  {
    id: "packs",
    label: "Pack ripping",
    caption: "Open sealed packs",
    icon: "packs",
    blurb:
      "Tear the wax, flip the cards. Sealed packs from raids and the campaign are opened here with a proper reveal.",
  },
  {
    id: "settings",
    label: "Settings",
    caption: "Audio · display · controls",
    icon: "settings",
    blurb:
      "Master and UI volume, motion reduction, cursor style, controller mapping. Settings are stored per device.",
  },
  {
    id: "minigames",
    label: "Mini games",
    caption: "Dice, duels & tavern games",
    icon: "minigames",
    blurb:
      "Knucklebones, rune dice and the duel pit. Quick rounds against clanmates while the war table loads.",
  },
];
