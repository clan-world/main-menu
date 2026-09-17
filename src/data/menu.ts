export type MenuId =
  | "play"
  | "howto"
  | "campaign"
  | "packs"
  | "settings"
  | "minigames";

export type MenuItem = {
  id: MenuId;
  title: string;
  subtitle: string;
  icon: string;
  primary?: boolean;
  kicker?: string;
  body: string;
  cta?: string;
};

/**
 * Hub list. Append items here — the left stack and right stage
 * both read from this array, so new entries show up without layout work.
 */
export const MENU: MenuItem[] = [
  {
    id: "play",
    title: "Play now",
    subtitle: "Step through the hearth",
    icon: "/art/icon-play.png",
    primary: true,
    kicker: "The realm is waiting",
    body: "The Ælder stands by the fire. Wheat is stacked. Torches hold the palisade. Winter is no longer a rumor — it is a date. Take the season in your hands.",
    cta: "Enter the realm",
  },
  {
    id: "howto",
    title: "How to play",
    subtitle: "Ælder, clansmen, winter",
    icon: "/art/icon-howto.png",
    kicker: "A short oath",
    body: "You speak. The Ælder acts. Send clansmen to forest, mountain, farms, and docks. Keep wheat for winter. Trade in Unicorn Town. Raise a monument so the next thaw still knows your name.",
  },
  {
    id: "campaign",
    title: "Gold Believers Campaign",
    subtitle: "A season of oaths and GOLD",
    icon: "/art/icon-gold.png",
    kicker: "Campaign",
    body: "Those who put faith in GOLD — the metal in the wagon, the glint in the vault — take a season-long oath. Raids, tithes, and a monument that must outlast the frost. No market. No ledger. Just belief.",
  },
  {
    id: "packs",
    title: "Pack ripping",
    subtitle: "Tear the foil. Read the omen.",
    icon: "/art/icon-pack.png",
    kicker: "The table is set",
    body: "Foil on the oak. Thumb in the tear. Charters, relics, and omens spill into the firelight. Rip slowly. The pack remembers hesitation.",
  },
  {
    id: "settings",
    title: "Settings",
    subtitle: "Sound, motion, cursor",
    icon: "/art/icon-settings.png",
    kicker: "The stone cog",
    body: "Tune the hall to your hands. None of this leaves the hearth.",
  },
  {
    id: "minigames",
    title: "Mini games",
    subtitle: "Tavern wagers by the fire",
    icon: "/art/icon-minigames.png",
    kicker: "After the work",
    body: "When the wagons are in, the hall plays. Hearth dice. Banner toss. Wagon race. Stakes are pride and a round of stories.",
  },
];

export const WHISPERS = [
  "The Ælder listens between the ticks.",
  "Winter comes for those who hoard wheat.",
  "GOLD believes. Do you?",
  "A clansman waits at Unicorn Town.",
  "The hearth remembers every oath.",
  "Rip the pack. Read the omen.",
  "Eight regions. Eight clans. One winter.",
  "Keep the fire. Keep the name.",
];
