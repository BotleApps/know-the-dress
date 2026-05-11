// Parametric dress illustration that adapts to neckline, length, sleeve, slit, fabric, and color.
// Fashion-sketch style — clean strokes, soft fills, elegant proportions.

import type { DressResult } from "./dress";
import { COLORS } from "./dress";

interface DressVizProps {
  params: DressResult["dressParams"];
  width?: number;
  height?: number;
  className?: string;
}

export function DressViz({ params, width = 220, height = 380, className }: DressVizProps) {
  const color = COLORS[params.color]?.hex ?? "#b8336a";
  const hemY = HEM_Y[params.length];
  const viewH = Math.max(hemY + 30, 280);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 200 ${viewH}`}
      fill="none"
      className={className}
      aria-label={`Dress illustration: ${params.neckline} neckline, ${params.length} length, ${params.sleeve} sleeves, ${params.slit === "none" ? "no slit" : params.slit + " slit"}, ${params.fabric} in ${params.color}`}
    >
      <defs>
        <linearGradient id="dressGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.85" />
          <stop offset="0.6" stopColor={color} stopOpacity="0.65" />
          <stop offset="1" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8c4a0" />
          <stop offset="1" stopColor="#d4a882" />
        </linearGradient>
        {/* fabric texture overlay */}
        {params.fabric === "tulle" && (
          <pattern id="tullePattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="0.8" fill="white" opacity="0.15" />
          </pattern>
        )}
        {params.fabric === "linen" && (
          <pattern id="linenPattern" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3" x2="6" y2="3" stroke="white" strokeWidth="0.3" opacity="0.12" />
            <line x1="3" y1="0" x2="3" y2="6" stroke="white" strokeWidth="0.3" opacity="0.12" />
          </pattern>
        )}
        {params.fabric === "satin" && (
          <linearGradient id="satinSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset="0.45" stopColor="white" stopOpacity="0.18" />
            <stop offset="0.55" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" stopOpacity="0.1" />
          </linearGradient>
        )}
      </defs>

      {/* Hair */}
      <ellipse cx="100" cy="18" rx="18" ry="20" fill="#2a1810" />
      <ellipse cx="100" cy="22" rx="14" ry="14" fill="#3d2317" />

      {/* Head */}
      <ellipse cx="100" cy="26" rx="12" ry="14" fill="url(#skinGrad)" />

      {/* Neck */}
      <rect x="95" y="38" width="10" height="10" fill="url(#skinGrad)" rx="4" />

      {/* Arms (behind dress) */}
      <SleeveArms sleeve={params.sleeve} hemY={hemY} />

      {/* Dress body */}
      <DressBody
        neckline={params.neckline}
        hemY={hemY}
        slit={params.slit}
        color={color}
      />

      {/* Fabric texture overlay */}
      {params.fabric === "tulle" && (
        <DressBody neckline={params.neckline} hemY={hemY} slit="none" color="url(#tullePattern) " overlay />
      )}
      {params.fabric === "linen" && (
        <DressBody neckline={params.neckline} hemY={hemY} slit="none" color="url(#linenPattern) " overlay />
      )}
      {params.fabric === "satin" && (
        <DressBody neckline={params.neckline} hemY={hemY} slit="none" color="url(#satinSheen) " overlay />
      )}

      {/* Sleeves (in front) */}
      <SleeveFront sleeve={params.sleeve} color={color} />

      {/* Legs (below dress) */}
      <Legs hemY={hemY} slit={params.slit} />

      {/* Feet */}
      <ellipse cx="88" cy={viewH - 8} rx="8" ry="4" fill="#222" opacity="0.7" />
      <ellipse cx="112" cy={viewH - 8} rx="8" ry="4" fill="#222" opacity="0.7" />

      {/* Waist accent line */}
      <path
        d={`M${waistL(params.neckline)} 110 Q100 114 ${waistR(params.neckline)} 110`}
        stroke="#222"
        strokeWidth="0.8"
        opacity="0.2"
        fill="none"
      />
    </svg>
  );
}

// ─── Constants ────────────────────────────────────

const HEM_Y: Record<string, number> = {
  mini:  170,
  knee:  210,
  tea:   250,
  midi:  280,
  maxi:  340,
};

function waistL(neckline: string): number {
  if (neckline === "off-shoulder") return 62;
  if (neckline === "one-shoulder") return 68;
  return 68;
}
function waistR(neckline: string): number {
  if (neckline === "off-shoulder") return 138;
  if (neckline === "one-shoulder") return 132;
  return 132;
}

// ─── Neckline paths ────────────────────────────────

function necklinePath(neckline: string): string {
  switch (neckline) {
    case "v-neck":
      return "M68 52 L100 80 L132 52";
    case "sweetheart":
      return "M68 52 C68 62 80 72 100 78 C120 72 132 62 132 52";
    case "halter":
      return "M82 48 L96 40 L100 38 L104 40 L118 48 L118 58 L82 58 Z";
    case "boat":
      return "M62 52 C78 46 122 46 138 52";
    case "square":
      return "M74 52 L74 64 L126 64 L126 52";
    case "off-shoulder":
      return "M54 58 C70 48 90 50 100 54 C110 50 130 48 146 58";
    case "strapless":
      return "M68 52 C78 48 122 48 132 52";
    case "scoop":
      return "M68 52 C68 66 100 78 100 78 C100 78 132 66 132 52";
    case "cowl":
      return "M72 52 C78 68 100 74 100 74 C100 74 122 68 128 52";
    case "one-shoulder":
      return "M68 44 L68 56 L132 62";
    case "high-neck":
      return "M78 38 L78 52 L122 52 L122 38";
    default:
      return "M68 52 L100 74 L132 52";
  }
}

// ─── Sub-components ────────────────────────────────

function DressBody({
  neckline,
  hemY,
  slit,
  color,
  overlay,
}: {
  neckline: string;
  hemY: number;
  slit: string;
  color: string;
  overlay?: boolean;
}) {
  // Build the skirt path with optional slit
  const skirtW = Math.min(hemY * 0.38, 80);
  const leftHem = 100 - skirtW;
  const rightHem = 100 + skirtW;

  // Bodice shoulders
  const shoulderL = neckline === "off-shoulder" ? 54 : 68;
  const shoulderR = neckline === "off-shoulder" ? 146 : neckline === "one-shoulder" ? 132 : 132;
  const neckTop = neckline === "boat" ? 52 : neckline === "off-shoulder" ? 58 : neckline === "strapless" ? 52 : neckline === "high-neck" ? 38 : neckline === "one-shoulder" ? 44 : 52;

  let path: string;

  if (slit === "none" || overlay) {
    path = `
      M${shoulderL} ${neckTop}
      ${necklinePath(neckline)}
      M${shoulderR} ${neckTop}
      L${waistR(neckline)} 110
      C${waistR(neckline) + 6} ${110 + (hemY - 110) * 0.4} ${rightHem + 4} ${hemY - 20} ${rightHem} ${hemY}
      L${leftHem} ${hemY}
      C${leftHem - 4} ${hemY - 20} ${waistL(neckline) - 6} ${110 + (hemY - 110) * 0.4} ${waistL(neckline)} 110
      L${shoulderL} ${neckTop}
      Z
    `;
  } else if (slit === "side") {
    const slitStart = 110 + (hemY - 110) * 0.35;
    path = `
      M${shoulderL} ${neckTop}
      ${necklinePath(neckline)}
      M${shoulderR} ${neckTop}
      L${waistR(neckline)} 110
      C${waistR(neckline) + 6} ${110 + (hemY - 110) * 0.4} ${rightHem + 4} ${hemY - 20} ${rightHem} ${hemY}
      L${rightHem - 10} ${slitStart}
      L${rightHem} ${hemY}
      L${leftHem} ${hemY}
      C${leftHem - 4} ${hemY - 20} ${waistL(neckline) - 6} ${110 + (hemY - 110) * 0.4} ${waistL(neckline)} 110
      L${shoulderL} ${neckTop}
      Z
    `;
  } else if (slit === "front") {
    path = `
      M${shoulderL} ${neckTop}
      ${necklinePath(neckline)}
      M${shoulderR} ${neckTop}
      L${waistR(neckline)} 110
      C${waistR(neckline) + 6} ${110 + (hemY - 110) * 0.4} ${rightHem + 4} ${hemY - 20} ${rightHem} ${hemY}
      L102 ${hemY}
      L102 ${110 + (hemY - 110) * 0.45}
      L98 ${110 + (hemY - 110) * 0.45}
      L98 ${hemY}
      L${leftHem} ${hemY}
      C${leftHem - 4} ${hemY - 20} ${waistL(neckline) - 6} ${110 + (hemY - 110) * 0.4} ${waistL(neckline)} 110
      L${shoulderL} ${neckTop}
      Z
    `;
  } else {
    // high slit
    const slitStart = 110 + (hemY - 110) * 0.15;
    path = `
      M${shoulderL} ${neckTop}
      ${necklinePath(neckline)}
      M${shoulderR} ${neckTop}
      L${waistR(neckline)} 110
      C${waistR(neckline) + 6} ${110 + (hemY - 110) * 0.4} ${rightHem + 4} ${hemY - 20} ${rightHem} ${hemY}
      L${rightHem - 14} ${slitStart}
      L${rightHem} ${hemY}
      L${leftHem} ${hemY}
      C${leftHem - 4} ${hemY - 20} ${waistL(neckline) - 6} ${110 + (hemY - 110) * 0.4} ${waistL(neckline)} 110
      L${shoulderL} ${neckTop}
      Z
    `;
  }

  return (
    <path
      d={path}
      fill={overlay ? color : "url(#dressGrad)"}
      stroke={overlay ? "none" : "#222"}
      strokeWidth={overlay ? 0 : 1}
      fillRule="evenodd"
    />
  );
}

function SleeveArms({ sleeve, hemY }: { sleeve: string; hemY: number }) {
  // Bare arms drawn behind the dress
  const armEndY = Math.min(hemY - 20, 200);
  if (sleeve === "long") return null; // arms hidden

  return (
    <g>
      {/* Left arm */}
      <path
        d={`M68 54 C60 70 52 ${armEndY * 0.6} ${52} ${armEndY}`}
        stroke="#d4a882"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right arm */}
      <path
        d={`M132 54 C140 70 148 ${armEndY * 0.6} ${148} ${armEndY}`}
        stroke="#d4a882"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

function SleeveFront({ sleeve, color }: { sleeve: string; color: string }) {
  switch (sleeve) {
    case "cap":
      return (
        <g>
          <ellipse cx="66" cy="56" rx="12" ry="8" fill={color} opacity="0.7" stroke="#222" strokeWidth="0.8" />
          <ellipse cx="134" cy="56" rx="12" ry="8" fill={color} opacity="0.7" stroke="#222" strokeWidth="0.8" />
        </g>
      );
    case "short":
      return (
        <g>
          <path d="M68 52 L54 58 L50 80 L68 74 Z" fill={color} opacity="0.65" stroke="#222" strokeWidth="0.8" />
          <path d="M132 52 L146 58 L150 80 L132 74 Z" fill={color} opacity="0.65" stroke="#222" strokeWidth="0.8" />
        </g>
      );
    case "long":
      return (
        <g>
          <path d="M68 52 L54 58 L46 190 L68 180 Z" fill={color} opacity="0.6" stroke="#222" strokeWidth="0.8" />
          <path d="M132 52 L146 58 L154 190 L132 180 Z" fill={color} opacity="0.6" stroke="#222" strokeWidth="0.8" />
        </g>
      );
    case "puff":
      return (
        <g>
          <ellipse cx="60" cy="58" rx="16" ry="12" fill={color} opacity="0.6" stroke="#222" strokeWidth="0.8" />
          <ellipse cx="140" cy="58" rx="16" ry="12" fill={color} opacity="0.6" stroke="#222" strokeWidth="0.8" />
          <path d="M54 68 L66 68" stroke="#222" strokeWidth="0.6" />
          <path d="M134 68 L146 68" stroke="#222" strokeWidth="0.6" />
        </g>
      );
    case "strap":
      return (
        <g>
          <line x1="86" y1="38" x2="74" y2="52" stroke={color} strokeWidth="3" />
          <line x1="114" y1="38" x2="126" y2="52" stroke={color} strokeWidth="3" />
          <line x1="86" y1="38" x2="74" y2="52" stroke="#222" strokeWidth="0.6" />
          <line x1="114" y1="38" x2="126" y2="52" stroke="#222" strokeWidth="0.6" />
        </g>
      );
    default: // sleeveless
      return null;
  }
}

function Legs({ hemY, slit }: { hemY: number; slit: string }) {
  if (hemY >= 320) return null; // maxi hides legs mostly

  const legLength = Math.min(380, hemY + 120);

  return (
    <g>
      {/* Left leg */}
      <line x1="90" y1={hemY - 4} x2="88" y2={legLength - 14} stroke="#d4a882" strokeWidth="6" strokeLinecap="round" />
      {/* Right leg */}
      {(slit === "side" || slit === "high") ? (
        <line x1="116" y1={hemY - 30} x2="112" y2={legLength - 14} stroke="#d4a882" strokeWidth="6" strokeLinecap="round" />
      ) : slit === "front" ? (
        <>
          <line x1="110" y1={hemY - 20} x2="112" y2={legLength - 14} stroke="#d4a882" strokeWidth="6" strokeLinecap="round" />
        </>
      ) : (
        <line x1="110" y1={hemY - 4} x2="112" y2={legLength - 14} stroke="#d4a882" strokeWidth="6" strokeLinecap="round" />
      )}
    </g>
  );
}
