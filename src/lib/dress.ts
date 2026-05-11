// Domain data + small recommendation engine for StyleSift.
// Pure functions — no side effects, easy to evolve.

export type Mood =
  | "playful"
  | "romantic"
  | "powerful"
  | "serene"
  | "edgy"
  | "dreamy";

export type Occasion =
  | "wedding"
  | "date"
  | "office"
  | "party"
  | "brunch"
  | "festival"
  | "cocktail";

export type Color =
  | "blush"
  | "ivory"
  | "emerald"
  | "midnight"
  | "ruby"
  | "sand"
  | "lilac"
  | "noir"
  | "red"
  | "blue"
  | "gold"
  | "black";

export type Season = "spring" | "summer" | "autumn" | "winter";

export type Neckline = "v-neck" | "sweetheart" | "halter" | "boat" | "square" | "off-shoulder" | "strapless" | "scoop" | "cowl" | "one-shoulder" | "high-neck";
export type Length = "mini" | "midi" | "maxi" | "tea" | "knee";
export type Fabric = "silk" | "chiffon" | "linen" | "satin" | "cotton" | "tulle" | "velvet";
export type Sleeve = "sleeveless" | "cap" | "short" | "long" | "puff" | "strap";
export type Slit = "none" | "side" | "front" | "high";
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface VibeAnswers {
  mood: Mood;
  occasion: Occasion;
  color: Color;
  season: Season;
  size: Size;
}

export interface BuilderAnswers {
  neckline: Neckline;
  length: Length;
  fabric: Fabric;
  sleeve: Sleeve;
  slit: Slit;
  color: Color;
  size: Size;
}

export interface DressResult {
  name: string;
  silhouette: string;
  characterName: string;
  tagline: string;
  details: string[];
  palette: { hex: string; label: string }[];
  pairings: string[];
  vibeWords: string[];
  size: Size;
  // For the parametric dress illustration
  dressParams: {
    neckline: Neckline;
    length: Length;
    fabric: Fabric;
    sleeve: Sleeve;
    slit: Slit;
    color: Color;
  };
}

export const COLORS: Record<Color, { hex: string; label: string }> = {
  blush:    { hex: "#f3c8cf", label: "Blush" },
  ivory:    { hex: "#f4ece1", label: "Ivory" },
  emerald:  { hex: "#1f6f4a", label: "Emerald" },
  midnight: { hex: "#1a2238", label: "Midnight" },
  ruby:     { hex: "#9b1d3a", label: "Ruby" },
  sand:     { hex: "#d8c5a3", label: "Sand" },
  lilac:    { hex: "#c8b6e2", label: "Lilac" },
  noir:     { hex: "#0f0f10", label: "Noir" },
  red:      { hex: "#d62828", label: "Red" },
  blue:     { hex: "#1d3557", label: "Blue" },
  gold:     { hex: "#c9a227", label: "Gold" },
  black:    { hex: "#111111", label: "Black" },
};

export const MOODS: { id: Mood; label: string; emoji: string; hint: string }[] = [
  { id: "playful",  label: "Playful",  emoji: "✿", hint: "light, flirty, kinetic" },
  { id: "romantic", label: "Romantic", emoji: "❀", hint: "soft, dreamy, tender" },
  { id: "powerful", label: "Powerful", emoji: "✦", hint: "sharp, sculpted, decisive" },
  { id: "serene",   label: "Serene",   emoji: "◐", hint: "calm, grounded, easy" },
  { id: "edgy",     label: "Edgy",     emoji: "▲", hint: "bold, modern, defiant" },
  { id: "dreamy",   label: "Dreamy",   emoji: "✺", hint: "ethereal, floaty, lit-from-within" },
];

export const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "wedding",   label: "Wedding guest" },
  { id: "date",      label: "Date night" },
  { id: "office",    label: "Office / work" },
  { id: "party",     label: "Party" },
  { id: "brunch",    label: "Brunch / day out" },
  { id: "festival",  label: "Festival" },
  { id: "cocktail",  label: "Cocktail event" },
];

export const SEASONS: { id: Season; label: string }[] = [
  { id: "spring", label: "Spring" },
  { id: "summer", label: "Summer" },
  { id: "autumn", label: "Autumn" },
  { id: "winter", label: "Winter" },
];

export const NECKLINES: Neckline[] = ["v-neck", "sweetheart", "halter", "strapless", "off-shoulder", "scoop", "cowl", "one-shoulder", "square", "boat", "high-neck"];
export const LENGTHS: Length[] = ["mini", "knee", "tea", "midi", "maxi"];
export const FABRICS: Fabric[] = ["silk", "chiffon", "linen", "satin", "cotton", "tulle", "velvet"];
export const SLEEVES: Sleeve[] = ["sleeveless", "strap", "cap", "short", "long", "puff"];
export const SLITS: Slit[] = ["none", "side", "front", "high"];
export const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

// ---------- Recommendation engine ----------

const STYLE_NAMES: Record<Mood, string[]> = {
  playful:  ["The Confetti Mini", "The Spritz Sundress", "The Daydream Skater"],
  romantic: ["The Aurora Slip", "The Letter Dress", "The Whisper Wrap"],
  powerful: ["The Architect Sheath", "The Verdict Column", "The Boardroom Blade"],
  serene:   ["The Sunday Linen", "The Driftwood Shift", "The Quiet Tea"],
  edgy:     ["The Razor Mini", "The Obsidian Slip", "The After-Hours Cut"],
  dreamy:   ["The Stardust Tulle", "The Halo Maxi", "The Moonlit Bias"],
};

const CHARACTER_NAMES: Record<Mood, string[]> = {
  playful:  ["Pixie", "Sunny", "Clover", "Mango", "Juno"],
  romantic: ["Lila", "Aria", "Rose", "Elise", "Marlowe"],
  powerful: ["Vega", "Sloane", "Iris", "Cassia", "Reign"],
  serene:   ["Wren", "Sage", "Linden", "Maren", "Ines"],
  edgy:     ["Rune", "Nyx", "Vex", "Jett", "Onyx"],
  dreamy:   ["Selene", "Lyra", "Aurelia", "Mira", "Cosima"],
};

const TAGLINES: Record<Mood, string[]> = {
  playful:  ["the room turns to watch you laugh", "made for spinning under fairy lights"],
  romantic: ["a love letter, worn", "soft like the pause before a kiss"],
  powerful: ["you don't enter a room — you redraw it", "tailored confidence, no apology"],
  serene:   ["the calm everyone secretly wants to sit beside", "an exhale in fabric"],
  edgy:     ["the plot twist nobody saw coming", "a quiet rebellion in motion"],
  dreamy:   ["spun from dusk and a little starlight", "you arrive like a soft idea"],
};

const VIBE_WORDS: Record<Mood, string[]> = {
  playful:  ["effervescent", "kinetic", "warm-hearted", "spontaneous"],
  romantic: ["tender", "luminous", "lyrical", "gentle"],
  powerful: ["decisive", "tailored", "magnetic", "composed"],
  serene:   ["grounded", "easy", "lived-in", "open"],
  edgy:     ["sculpted", "modern", "unbothered", "sharp"],
  dreamy:   ["ethereal", "floaty", "soft-focus", "weightless"],
};

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function hash(parts: (string | number)[]): number {
  let h = 2166136261;
  for (const p of parts) {
    const s = String(p);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
  }
  return h | 0;
}

function silhouetteFromMood(mood: Mood, occasion: Occasion, season: Season): {
  silhouette: string;
  details: string[];
  dressParams: DressResult["dressParams"];
} {
  const seasonalFabric: Record<Season, Fabric> = {
    spring: "chiffon",
    summer: "linen",
    autumn: "satin",
    winter: "velvet",
  };
  const map: Record<Mood, { silhouette: string; details: string[]; neckline: Neckline; length: Length; sleeve: Sleeve; slit: Slit; fabric: Fabric }> = {
    playful: {
      silhouette: "A skater silhouette with a fitted bodice and a swing skirt that catches light when you move.",
      details: ["square neckline", "knee length", "puff sleeves", "side pockets"],
      neckline: "square", length: "knee", sleeve: "puff", slit: "none", fabric: seasonalFabric[season],
    },
    romantic: {
      silhouette: "A bias-cut slip that skims the body and pools at the hem like spilled silk.",
      details: ["sweetheart neckline", "midi length", "delicate straps", "soft cowl back", "silk-satin"],
      neckline: "sweetheart", length: "midi", sleeve: "strap", slit: "none", fabric: "silk",
    },
    powerful: {
      silhouette: "A sculpted column with a sharp shoulder line and a single, decisive slit.",
      details: ["v-neckline", "maxi length", "long sleeves", "high front slit", "double-faced crepe"],
      neckline: "v-neck", length: "maxi", sleeve: "long", slit: "front", fabric: "satin",
    },
    serene: {
      silhouette: "A relaxed shift that drapes from the shoulder, easy to move in, easy to be in.",
      details: ["boat neckline", "tea length", "cap sleeves", "no slit", "washed linen"],
      neckline: "boat", length: "tea", sleeve: "cap", slit: "none", fabric: "linen",
    },
    edgy: {
      silhouette: "An asymmetric mini with raw, architectural lines and one bare shoulder.",
      details: ["off-shoulder", "mini length", "single sleeve", "side slit", "matte silk"],
      neckline: "off-shoulder", length: "mini", sleeve: "short", slit: "side", fabric: "silk",
    },
    dreamy: {
      silhouette: "A floor-skimming bias dress with an organza overlay that floats half a beat behind you.",
      details: ["halter neckline", "maxi length", "sleeveless", "no slit", "tulle overlay"],
      neckline: "halter", length: "maxi", sleeve: "sleeveless", slit: "none", fabric: "tulle",
    },
  };
  const base = map[mood];
  const occasionDetail: Record<Occasion, string> = {
    wedding:  "guest-appropriate hemline",
    date:     "subtle back detail",
    office:   "polished, meeting-ready",
    party:    "moves well on a dance floor",
    brunch:   "easy to layer with a cardigan",
    festival: "comfortable for long days",
    cocktail: "elevated for a 7pm room",
  };
  return {
    silhouette: base.silhouette,
    details: [...base.details, occasionDetail[occasion]],
    dressParams: {
      neckline: base.neckline,
      length: base.length,
      sleeve: base.sleeve,
      slit: base.slit,
      fabric: base.fabric,
      color: "blush" as Color, // overridden by caller
    },
  };
}

export function recommendFromVibe(a: VibeAnswers): DressResult {
  const seed = hash([a.mood, a.occasion, a.color, a.season]);
  const { silhouette, details, dressParams } = silhouetteFromMood(a.mood, a.occasion, a.season);
  const palette = paletteFor(a.color, a.mood);
  return {
    name: pick(STYLE_NAMES[a.mood], seed),
    silhouette,
    characterName: pick(CHARACTER_NAMES[a.mood], seed >> 3),
    tagline: pick(TAGLINES[a.mood], seed >> 5),
    details,
    palette,
    pairings: pairingsFor(a.mood, a.occasion),
    vibeWords: VIBE_WORDS[a.mood],
    size: a.size,
    dressParams: { ...dressParams, color: a.color },
  };
}

export function recommendFromBuilder(b: BuilderAnswers): DressResult {
  const mood: Mood = inferMood(b);
  const seed = hash([b.neckline, b.length, b.fabric, b.sleeve, b.slit, b.color]);
  return {
    name: pick(STYLE_NAMES[mood], seed),
    silhouette: `A ${b.length} ${b.fabric} dress with a ${b.neckline} neckline, ${b.sleeve} sleeves and ${
      b.slit === "none" ? "a clean, uninterrupted hem" : `a ${b.slit} slit`
    }.`,
    characterName: pick(CHARACTER_NAMES[mood], seed >> 3),
    tagline: pick(TAGLINES[mood], seed >> 5),
    details: [
      `${b.neckline} neckline`,
      `${b.length} length`,
      `${b.sleeve} sleeves`,
      `${b.slit === "none" ? "no slit" : `${b.slit} slit`}`,
      `${b.fabric} fabric`,
    ],
    palette: paletteFor(b.color, mood),
    pairings: pairingsFor(mood, "cocktail"),
    vibeWords: VIBE_WORDS[mood],
    size: b.size,
    dressParams: {
      neckline: b.neckline,
      length: b.length,
      fabric: b.fabric,
      sleeve: b.sleeve,
      slit: b.slit,
      color: b.color,
    },
  };
}

function inferMood(b: BuilderAnswers): Mood {
  if (b.fabric === "tulle" || b.fabric === "chiffon") return "dreamy";
  if (b.fabric === "velvet" || b.color === "noir" || b.color === "midnight" || b.color === "black") return "edgy";
  if (b.fabric === "linen" || b.fabric === "cotton") return "serene";
  if (b.fabric === "satin" && b.length === "maxi") return "romantic";
  if (b.length === "mini" && b.sleeve === "puff") return "playful";
  if (b.slit === "high" || b.slit === "front") return "powerful";
  return "romantic";
}

function paletteFor(primary: Color, mood: Mood): { hex: string; label: string }[] {
  const accentByMood: Record<Mood, Color[]> = {
    playful:  ["blush", "ivory", "lilac"],
    romantic: ["blush", "ivory", "sand"],
    powerful: ["noir", "ruby", "midnight"],
    serene:   ["sand", "ivory", "lilac"],
    edgy:     ["noir", "midnight", "ruby"],
    dreamy:   ["lilac", "ivory", "blush"],
  };
  const set = new Set<Color>([primary, ...accentByMood[mood]]);
  return [...set].slice(0, 4).map((c) => COLORS[c]);
}

function pairingsFor(mood: Mood, occasion: Occasion): string[] {
  const shoes: Record<Mood, string> = {
    playful: "block-heel sandals or white sneakers",
    romantic: "satin slingbacks or barely-there flats",
    powerful: "pointed pumps or sharp ankle boots",
    serene: "leather slides or woven flats",
    edgy: "chunky loafers or strappy heels",
    dreamy: "metallic mules or low ballet flats",
  };
  const bag: Record<Occasion, string> = {
    wedding: "a small structured clutch",
    date: "a mini shoulder bag",
    office: "a soft leather tote",
    party: "a metallic wristlet",
    brunch: "a woven crossbody",
    festival: "a small belt bag",
    cocktail: "a beaded clutch",
  };
  return [
    `Shoes — ${shoes[mood]}`,
    `Bag — ${bag[occasion]}`,
    `Jewellery — one statement piece, nothing more`,
  ];
}
