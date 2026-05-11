// Fashion-sketch-style SVG illustrations for every selectable option.
// Minimal line art with accent fills — think fashion illustration, not UI icon.

import type { Fabric, Length, Mood, Neckline, Occasion, Season, Slit, Sleeve } from "./dress";

const S = 56; // default viewBox size

// ─── Mood illustrations ──────────────────────────

const MoodIcons: Record<Mood, JSX.Element> = {
  playful: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="18" cy="14" r="4" fill="#b8336a" opacity="0.6" />
      <circle cx="38" cy="10" r="3" fill="#b8336a" opacity="0.4" />
      <circle cx="28" cy="22" r="5" fill="#b8336a" opacity="0.3" />
      <path d="M14 36 C 18 28 38 28 42 36" stroke="#222" strokeWidth="1.5" fill="none" />
      <circle cx="16" cy="42" r="2.5" fill="#f3c8cf" />
      <circle cx="28" cy="46" r="3" fill="#f3c8cf" />
      <circle cx="40" cy="42" r="2.5" fill="#f3c8cf" />
      <path d="M10 50 Q28 42 46 50" stroke="#222" strokeWidth="1" strokeDasharray="2 3" />
    </svg>
  ),
  romantic: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <path d="M28 48 C 10 34 10 18 20 14 C 26 11 28 18 28 18 C 28 18 30 11 36 14 C 46 18 46 34 28 48Z" fill="#f3c8cf" opacity="0.5" stroke="#b8336a" strokeWidth="1.2" />
      <path d="M28 48 C 10 34 10 18 20 14" stroke="#b8336a" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 2" />
    </svg>
  ),
  powerful: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <polygon points="28,6 46,22 40,50 16,50 10,22" fill="none" stroke="#222" strokeWidth="1.5" />
      <polygon points="28,16 38,26 34,42 22,42 18,26" fill="#b8336a" opacity="0.2" />
      <line x1="28" y1="6" x2="28" y2="50" stroke="#222" strokeWidth="0.8" strokeDasharray="3 3" />
    </svg>
  ),
  serene: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <path d="M6 28 Q14 20 22 28 Q30 36 38 28 Q46 20 54 28" stroke="#222" strokeWidth="1.5" />
      <path d="M6 36 Q14 28 22 36 Q30 44 38 36 Q46 28 54 36" stroke="#b8336a" strokeWidth="1" opacity="0.4" />
      <circle cx="28" cy="18" r="6" fill="#f3c8cf" opacity="0.3" />
    </svg>
  ),
  edgy: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <path d="M8 46 L20 10 L32 38 L44 8 L48 46" stroke="#222" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M20 10 L32 38" stroke="#b8336a" strokeWidth="2" />
      <circle cx="44" cy="8" r="3" fill="#b8336a" opacity="0.5" />
    </svg>
  ),
  dreamy: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="28" r="16" fill="#c8b6e2" opacity="0.15" />
      <circle cx="28" cy="28" r="10" fill="#c8b6e2" opacity="0.2" />
      <path d="M28 12 L29 18 L34 14 L30 19 L36 20 L30 22 L34 27 L28 23 L22 27 L26 22 L20 20 L26 19 L22 14 L27 18 Z" fill="#b8336a" opacity="0.55" />
      <circle cx="14" cy="16" r="1.5" fill="#b8336a" opacity="0.3" />
      <circle cx="42" cy="14" r="1" fill="#b8336a" opacity="0.3" />
      <circle cx="44" cy="38" r="1.5" fill="#b8336a" opacity="0.2" />
    </svg>
  ),
};

export function MoodIcon({ mood }: { mood: Mood }) {
  return MoodIcons[mood] ?? null;
}

// ─── Occasion illustrations ──────────────────────

const OccasionIcons: Record<Occasion, JSX.Element> = {
  wedding: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M14 30 C14 22 10 18 10 14 C10 8 14 6 18 6 C20 6 22 8 22 10" stroke="#222" strokeWidth="1.3" fill="none"/>
      <path d="M26 30 C26 22 30 18 30 14 C30 8 26 6 22 6 C20 6 18 8 18 10" stroke="#222" strokeWidth="1.3" fill="none"/>
      <circle cx="20" cy="6" r="2" fill="#b8336a" opacity="0.6"/>
      <path d="M10 34 L30 34" stroke="#222" strokeWidth="1"/>
    </svg>
  ),
  date: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M20 34 L20 16" stroke="#222" strokeWidth="1.3"/>
      <ellipse cx="20" cy="12" rx="4" ry="6" fill="#b8336a" opacity="0.35"/>
      <path d="M18 8 C18 4 22 4 22 8" stroke="#b8336a" strokeWidth="0.8"/>
      <path d="M14 34 L26 34" stroke="#222" strokeWidth="1"/>
    </svg>
  ),
  office: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="8" y="14" width="24" height="18" rx="2" stroke="#222" strokeWidth="1.3" fill="none"/>
      <path d="M14 14 L14 10 C14 8 16 6 20 6 C24 6 26 8 26 10 L26 14" stroke="#222" strokeWidth="1.3" fill="none"/>
      <circle cx="20" cy="23" r="3" fill="#b8336a" opacity="0.3"/>
    </svg>
  ),
  party: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="18" r="8" stroke="#222" strokeWidth="1.3" fill="none"/>
      <circle cx="20" cy="18" r="3" fill="#b8336a" opacity="0.3"/>
      <line x1="20" y1="10" x2="20" y2="6" stroke="#222" strokeWidth="1"/>
      <line x1="12" y1="12" x2="9" y2="9" stroke="#222" strokeWidth="1"/>
      <line x1="28" y1="12" x2="31" y2="9" stroke="#222" strokeWidth="1"/>
      <line x1="12" y1="24" x2="9" y2="27" stroke="#222" strokeWidth="1"/>
      <line x1="28" y1="24" x2="31" y2="27" stroke="#222" strokeWidth="1"/>
      <path d="M14 32 L26 32" stroke="#222" strokeWidth="1.3"/>
      <path d="M20 26 L20 32" stroke="#222" strokeWidth="1.3"/>
    </svg>
  ),
  brunch: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M10 28 C10 20 14 16 20 16 C26 16 30 20 30 28 Z" fill="none" stroke="#222" strokeWidth="1.3"/>
      <path d="M8 28 L32 28" stroke="#222" strokeWidth="1.3"/>
      <path d="M30 22 L34 18 L34 26 L30 24" stroke="#222" strokeWidth="1" fill="none"/>
      <path d="M16 12 C16 8 18 8 18 12" stroke="#b8336a" strokeWidth="1" opacity="0.5"/>
      <path d="M20 10 C20 6 22 6 22 10" stroke="#b8336a" strokeWidth="1" opacity="0.5"/>
      <path d="M24 12 C24 8 26 8 26 12" stroke="#b8336a" strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  festival: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M20 6 L28 32 L12 32 Z" fill="#b8336a" opacity="0.15" stroke="#222" strokeWidth="1.3"/>
      <path d="M20 6 L20 2" stroke="#222" strokeWidth="1.2"/>
      <circle cx="20" cy="2" r="1.5" fill="#b8336a" opacity="0.5"/>
      <path d="M16 20 L24 20" stroke="#222" strokeWidth="0.8" strokeDasharray="2 2"/>
      <path d="M14 26 L26 26" stroke="#222" strokeWidth="0.8" strokeDasharray="2 2"/>
    </svg>
  ),
  cocktail: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M12 10 L20 22 L28 10" stroke="#222" strokeWidth="1.3" fill="none"/>
      <path d="M12 10 L28 10" stroke="#222" strokeWidth="1.3"/>
      <path d="M20 22 L20 32" stroke="#222" strokeWidth="1.3"/>
      <path d="M14 32 L26 32" stroke="#222" strokeWidth="1.3"/>
      <circle cx="24" cy="14" r="2" fill="#b8336a" opacity="0.4"/>
      <path d="M26 8 L28 4" stroke="#b8336a" strokeWidth="0.8"/>
      <circle cx="29" cy="3" r="1.5" fill="#b8336a" opacity="0.3"/>
    </svg>
  ),
};

export function OccasionIcon({ occasion }: { occasion: Occasion }) {
  return OccasionIcons[occasion] ?? null;
}

// ─── Season illustrations ──────────────────────

const SeasonIcons: Record<Season, JSX.Element> = {
  spring: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="16" r="4" fill="#b8336a" opacity="0.3"/>
      <path d="M20 16 C16 12 20 6 20 6 C20 6 24 12 20 16" fill="#b8336a" opacity="0.2"/>
      <path d="M20 16 C16 20 10 20 10 16 C10 16 16 12 20 16" fill="#b8336a" opacity="0.2"/>
      <path d="M20 16 C24 20 30 20 30 16 C30 16 24 12 20 16" fill="#b8336a" opacity="0.2"/>
      <path d="M20 16 C16 20 20 26 20 26 C20 26 24 20 20 16" fill="#b8336a" opacity="0.2"/>
      <path d="M20 26 L20 36" stroke="#222" strokeWidth="1.2"/>
      <path d="M16 30 L20 26 L24 30" stroke="#222" strokeWidth="0.8" fill="none"/>
    </svg>
  ),
  summer: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="7" fill="#b8336a" opacity="0.2" stroke="#222" strokeWidth="1.2"/>
      <line x1="20" y1="8" x2="20" y2="4" stroke="#222" strokeWidth="1.2"/>
      <line x1="20" y1="36" x2="20" y2="32" stroke="#222" strokeWidth="1.2"/>
      <line x1="8" y1="20" x2="4" y2="20" stroke="#222" strokeWidth="1.2"/>
      <line x1="36" y1="20" x2="32" y2="20" stroke="#222" strokeWidth="1.2"/>
      <line x1="11.5" y1="11.5" x2="8.5" y2="8.5" stroke="#222" strokeWidth="1"/>
      <line x1="28.5" y1="11.5" x2="31.5" y2="8.5" stroke="#222" strokeWidth="1"/>
      <line x1="11.5" y1="28.5" x2="8.5" y2="31.5" stroke="#222" strokeWidth="1"/>
      <line x1="28.5" y1="28.5" x2="31.5" y2="31.5" stroke="#222" strokeWidth="1"/>
    </svg>
  ),
  autumn: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M20 4 C26 10 30 20 26 30 C24 34 20 36 20 36 C20 36 16 34 14 30 C10 20 14 10 20 4Z" fill="#b8336a" opacity="0.15" stroke="#222" strokeWidth="1.2"/>
      <path d="M20 4 L20 36" stroke="#222" strokeWidth="0.8"/>
      <path d="M14 16 L20 20" stroke="#222" strokeWidth="0.7"/>
      <path d="M26 14 L20 18" stroke="#222" strokeWidth="0.7"/>
      <path d="M15 24 L20 26" stroke="#222" strokeWidth="0.7"/>
    </svg>
  ),
  winter: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <line x1="20" y1="4" x2="20" y2="36" stroke="#222" strokeWidth="1.2"/>
      <line x1="4" y1="20" x2="36" y2="20" stroke="#222" strokeWidth="1.2"/>
      <line x1="9" y1="9" x2="31" y2="31" stroke="#222" strokeWidth="0.8"/>
      <line x1="31" y1="9" x2="9" y2="31" stroke="#222" strokeWidth="0.8"/>
      <line x1="16" y1="8" x2="20" y2="12" stroke="#b8336a" strokeWidth="0.8"/>
      <line x1="24" y1="8" x2="20" y2="12" stroke="#b8336a" strokeWidth="0.8"/>
      <line x1="16" y1="32" x2="20" y2="28" stroke="#b8336a" strokeWidth="0.8"/>
      <line x1="24" y1="32" x2="20" y2="28" stroke="#b8336a" strokeWidth="0.8"/>
      <circle cx="20" cy="20" r="3" fill="#b8336a" opacity="0.15"/>
    </svg>
  ),
};

export function SeasonIcon({ season }: { season: Season }) {
  return SeasonIcons[season] ?? null;
}

// ─── Neckline illustrations (upper-body dress sketch) ─────────

const NecklineIcons: Record<Neckline, JSX.Element> = {
  "v-neck": (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="10" r="6" fill="#f4ece1"/>
      <path d="M18 18 L28 34 L38 18" stroke="#222" strokeWidth="1.4" fill="#f3c8cf" fillOpacity="0.3"/>
      <path d="M14 18 L18 18 L28 34 L38 18 L42 18 L42 52 L14 52 Z" fill="#b8336a" fillOpacity="0.12"/>
      <path d="M14 18 L42 18" stroke="#222" strokeWidth="1.2"/>
    </svg>
  ),
  sweetheart: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="10" r="6" fill="#f4ece1"/>
      <path d="M16 18 C16 24 22 28 28 32 C34 28 40 24 40 18" stroke="#222" strokeWidth="1.4" fill="#f3c8cf" fillOpacity="0.3"/>
      <path d="M14 18 L16 18 C16 24 22 28 28 32 C34 28 40 24 40 18 L42 18 L42 52 L14 52 Z" fill="#b8336a" fillOpacity="0.12"/>
      <path d="M14 18 L42 18" stroke="#222" strokeWidth="1.2"/>
    </svg>
  ),
  halter: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="10" r="6" fill="#f4ece1"/>
      <path d="M22 16 L28 10 L34 16" stroke="#222" strokeWidth="1.3" fill="none"/>
      <path d="M22 16 L20 28 L36 28 L34 16" stroke="#222" strokeWidth="1.4" fill="#b8336a" fillOpacity="0.12"/>
      <path d="M14 28 L20 28 L18 52 L14 52 Z" fill="#b8336a" fillOpacity="0.08"/>
      <path d="M36 28 L42 28 L42 52 L38 52 Z" fill="#b8336a" fillOpacity="0.08"/>
      <path d="M20 28 L36 28 L38 52 L18 52 Z" fill="#b8336a" fillOpacity="0.12"/>
    </svg>
  ),
  boat: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="10" r="6" fill="#f4ece1"/>
      <path d="M12 22 C18 18 38 18 44 22" stroke="#222" strokeWidth="1.4" fill="none"/>
      <path d="M12 22 C18 18 38 18 44 22 L44 52 L12 52 Z" fill="#b8336a" fillOpacity="0.12"/>
      <path d="M12 22 L44 22" stroke="#222" strokeWidth="0.8" strokeDasharray="3 2"/>
    </svg>
  ),
  square: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="10" r="6" fill="#f4ece1"/>
      <path d="M18 20 L18 26 L38 26 L38 20" stroke="#222" strokeWidth="1.4" fill="#f3c8cf" fillOpacity="0.3"/>
      <path d="M14 20 L18 20 L18 26 L38 26 L38 20 L42 20 L42 52 L14 52 Z" fill="#b8336a" fillOpacity="0.12"/>
      <path d="M14 20 L42 20" stroke="#222" strokeWidth="1.2"/>
    </svg>
  ),
  "off-shoulder": (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="10" r="6" fill="#f4ece1"/>
      <path d="M8 26 C14 20 24 22 28 24 C32 22 42 20 48 26" stroke="#222" strokeWidth="1.4" fill="none"/>
      <path d="M12 26 L12 52 L44 52 L44 26 C38 22 32 22 28 24 C24 22 18 22 12 26Z" fill="#b8336a" fillOpacity="0.12"/>
      <line x1="8" y1="26" x2="12" y2="26" stroke="#222" strokeWidth="1" strokeDasharray="2 2"/>
      <line x1="44" y1="26" x2="48" y2="26" stroke="#222" strokeWidth="1" strokeDasharray="2 2"/>
    </svg>
  ),
};

export function NecklineIcon({ neckline }: { neckline: Neckline }) {
  return NecklineIcons[neckline] ?? null;
}

// ─── Length illustrations ──────────────────────

function LengthSketch({ hemY, label }: { hemY: number; label: string }) {
  return (
    <svg width={S} height={S} viewBox="0 0 56 72" fill="none" aria-hidden>
      <circle cx="28" cy="8" r="5" fill="#f4ece1"/>
      <path d={`M20 14 L28 14 L36 14 L40 ${hemY} L16 ${hemY} Z`} fill="#b8336a" fillOpacity="0.15" stroke="#222" strokeWidth="1.2"/>
      {/* legs */}
      <line x1="22" y1={hemY} x2="20" y2="68" stroke="#222" strokeWidth="1" strokeDasharray="2 3"/>
      <line x1="34" y1={hemY} x2="36" y2="68" stroke="#222" strokeWidth="1" strokeDasharray="2 3"/>
      {/* hem marker */}
      <line x1="44" y1={hemY} x2="50" y2={hemY} stroke="#b8336a" strokeWidth="1.2"/>
      <text x="46" y={hemY - 3} fontSize="6" fill="#b8336a" fontWeight="600">{label}</text>
    </svg>
  );
}

const LengthIcons: Record<Length, JSX.Element> = {
  mini:  <LengthSketch hemY={30} label="mini" />,
  knee:  <LengthSketch hemY={38} label="knee" />,
  tea:   <LengthSketch hemY={48} label="tea" />,
  midi:  <LengthSketch hemY={54} label="midi" />,
  maxi:  <LengthSketch hemY={64} label="maxi" />,
};

export function LengthIcon({ length }: { length: Length }) {
  return LengthIcons[length] ?? null;
}

// ─── Sleeve illustrations ──────────────────────

const SleeveIcons: Record<Sleeve, JSX.Element> = {
  sleeveless: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="10" r="5" fill="#f4ece1"/>
      <path d="M22 16 L22 44 L34 44 L34 16" fill="#b8336a" fillOpacity="0.12" stroke="#222" strokeWidth="1.2"/>
      <line x1="10" y1="16" x2="22" y2="16" stroke="#222" strokeWidth="1" strokeDasharray="2 3"/>
      <line x1="34" y1="16" x2="46" y2="16" stroke="#222" strokeWidth="1" strokeDasharray="2 3"/>
    </svg>
  ),
  strap: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="10" r="5" fill="#f4ece1"/>
      <line x1="24" y1="14" x2="22" y2="20" stroke="#222" strokeWidth="1.5"/>
      <line x1="32" y1="14" x2="34" y2="20" stroke="#222" strokeWidth="1.5"/>
      <path d="M22 20 L22 44 L34 44 L34 20" fill="#b8336a" fillOpacity="0.12" stroke="#222" strokeWidth="1.2"/>
    </svg>
  ),
  cap: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="10" r="5" fill="#f4ece1"/>
      <path d="M22 16 L22 44 L34 44 L34 16" fill="#b8336a" fillOpacity="0.12" stroke="#222" strokeWidth="1.2"/>
      <path d="M22 16 C18 16 14 18 14 22 L22 22" fill="#b8336a" fillOpacity="0.1" stroke="#222" strokeWidth="1"/>
      <path d="M34 16 C38 16 42 18 42 22 L34 22" fill="#b8336a" fillOpacity="0.1" stroke="#222" strokeWidth="1"/>
    </svg>
  ),
  short: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="10" r="5" fill="#f4ece1"/>
      <path d="M22 16 L22 44 L34 44 L34 16" fill="#b8336a" fillOpacity="0.12" stroke="#222" strokeWidth="1.2"/>
      <path d="M22 16 L14 18 L12 28 L22 26" fill="#b8336a" fillOpacity="0.1" stroke="#222" strokeWidth="1"/>
      <path d="M34 16 L42 18 L44 28 L34 26" fill="#b8336a" fillOpacity="0.1" stroke="#222" strokeWidth="1"/>
    </svg>
  ),
  long: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="10" r="5" fill="#f4ece1"/>
      <path d="M22 16 L22 44 L34 44 L34 16" fill="#b8336a" fillOpacity="0.12" stroke="#222" strokeWidth="1.2"/>
      <path d="M22 16 L14 18 L10 42 L22 38" fill="#b8336a" fillOpacity="0.1" stroke="#222" strokeWidth="1"/>
      <path d="M34 16 L42 18 L46 42 L34 38" fill="#b8336a" fillOpacity="0.1" stroke="#222" strokeWidth="1"/>
    </svg>
  ),
  puff: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <circle cx="28" cy="10" r="5" fill="#f4ece1"/>
      <path d="M22 16 L22 44 L34 44 L34 16" fill="#b8336a" fillOpacity="0.12" stroke="#222" strokeWidth="1.2"/>
      <ellipse cx="16" cy="20" rx="6" ry="5" fill="#b8336a" fillOpacity="0.15" stroke="#222" strokeWidth="1"/>
      <ellipse cx="40" cy="20" rx="6" ry="5" fill="#b8336a" fillOpacity="0.15" stroke="#222" strokeWidth="1"/>
    </svg>
  ),
};

export function SleeveIcon({ sleeve }: { sleeve: Sleeve }) {
  return SleeveIcons[sleeve] ?? null;
}

// ─── Slit illustrations ──────────────────────

const SlitIcons: Record<Slit, JSX.Element> = {
  none: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <path d="M18 8 L14 52 L42 52 L38 8 Z" fill="#b8336a" fillOpacity="0.12" stroke="#222" strokeWidth="1.2"/>
      <path d="M14 52 L42 52" stroke="#222" strokeWidth="1.4"/>
    </svg>
  ),
  side: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <path d="M18 8 L14 52 L42 52 L38 8 Z" fill="#b8336a" fillOpacity="0.12" stroke="#222" strokeWidth="1.2"/>
      <path d="M42 52 L38 28" stroke="#b8336a" strokeWidth="1.8"/>
      <line x1="38" y1="28" x2="42" y2="28" stroke="#b8336a" strokeWidth="0.8" strokeDasharray="2 2"/>
    </svg>
  ),
  front: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <path d="M18 8 L14 52 L42 52 L38 8 Z" fill="#b8336a" fillOpacity="0.12" stroke="#222" strokeWidth="1.2"/>
      <path d="M28 52 L28 24" stroke="#b8336a" strokeWidth="1.8"/>
    </svg>
  ),
  high: (
    <svg width={S} height={S} viewBox="0 0 56 56" fill="none" aria-hidden>
      <path d="M18 8 L14 52 L42 52 L38 8 Z" fill="#b8336a" fillOpacity="0.12" stroke="#222" strokeWidth="1.2"/>
      <path d="M42 52 L36 16" stroke="#b8336a" strokeWidth="2"/>
      <line x1="36" y1="16" x2="42" y2="16" stroke="#b8336a" strokeWidth="0.8" strokeDasharray="2 2"/>
    </svg>
  ),
};

export function SlitIcon({ slit }: { slit: Slit }) {
  return SlitIcons[slit] ?? null;
}

// ─── Fabric illustrations (texture swatches) ─────

const FabricIcons: Record<Fabric, JSX.Element> = {
  silk: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
      <rect x="4" y="4" width="36" height="36" rx="8" fill="#f4ece1"/>
      <path d="M8 16 Q16 12 22 18 Q28 24 36 20" stroke="#b8336a" strokeWidth="0.8" opacity="0.5"/>
      <path d="M8 24 Q16 20 22 26 Q28 32 36 28" stroke="#b8336a" strokeWidth="0.8" opacity="0.4"/>
      <path d="M8 32 Q16 28 22 34 Q28 40 36 36" stroke="#b8336a" strokeWidth="0.8" opacity="0.3"/>
    </svg>
  ),
  chiffon: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
      <rect x="4" y="4" width="36" height="36" rx="8" fill="#f4ece1" opacity="0.5"/>
      {[10,18,26,34].map(y => [10,18,26,34].map(x =>
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#b8336a" opacity="0.2"/>
      ))}
      <rect x="4" y="4" width="36" height="36" rx="8" stroke="#222" strokeWidth="0.8" strokeDasharray="2 3"/>
    </svg>
  ),
  linen: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
      <rect x="4" y="4" width="36" height="36" rx="8" fill="#f4ece1"/>
      {[10,16,22,28,34].map(x =>
        <line key={`v${x}`} x1={x} y1="4" x2={x} y2="40" stroke="#222" strokeWidth="0.4" opacity="0.2"/>
      )}
      {[10,16,22,28,34].map(y =>
        <line key={`h${y}`} x1="4" y1={y} x2="40" y2={y} stroke="#222" strokeWidth="0.4" opacity="0.2"/>
      )}
    </svg>
  ),
  satin: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
      <rect x="4" y="4" width="36" height="36" rx="8" fill="#f3c8cf" opacity="0.3"/>
      <path d="M10 10 L34 34" stroke="white" strokeWidth="4" opacity="0.4"/>
      <path d="M18 8 L40 30" stroke="white" strokeWidth="2" opacity="0.25"/>
      <rect x="4" y="4" width="36" height="36" rx="8" stroke="#222" strokeWidth="0.8"/>
    </svg>
  ),
  cotton: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
      <rect x="4" y="4" width="36" height="36" rx="8" fill="#f4ece1"/>
      {[12,22,32].map(y => [12,22,32].map(x =>
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="none" stroke="#222" strokeWidth="0.5" opacity="0.25"/>
      ))}
    </svg>
  ),
  tulle: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
      <rect x="4" y="4" width="36" height="36" rx="8" fill="#c8b6e2" opacity="0.15"/>
      <rect x="8" y="8" width="28" height="28" rx="6" fill="#c8b6e2" opacity="0.1"/>
      <rect x="12" y="12" width="20" height="20" rx="4" fill="#c8b6e2" opacity="0.1"/>
      <rect x="4" y="4" width="36" height="36" rx="8" stroke="#222" strokeWidth="0.6" strokeDasharray="3 2"/>
    </svg>
  ),
  velvet: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
      <rect x="4" y="4" width="36" height="36" rx="8" fill="#460479" opacity="0.15"/>
      <rect x="4" y="4" width="36" height="36" rx="8" fill="url(#velvetGrad)"/>
      <defs>
        <linearGradient id="velvetGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#460479" stopOpacity="0.2"/>
          <stop offset="0.5" stopColor="#460479" stopOpacity="0.05"/>
          <stop offset="1" stopColor="#460479" stopOpacity="0.2"/>
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="36" height="36" rx="8" stroke="#222" strokeWidth="0.8"/>
    </svg>
  ),
};

export function FabricIcon({ fabric }: { fabric: Fabric }) {
  return FabricIcons[fabric] ?? null;
}
