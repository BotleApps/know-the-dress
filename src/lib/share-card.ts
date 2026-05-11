// Generate a shareable card image using Canvas 2D API.
// No external dependencies — pure browser APIs.

import type { DressResult } from "./dress";
import { COLORS } from "./dress";

const W = 720;
const H = 1280;

export async function generateShareCard(result: DressResult): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const mainColor = COLORS[result.dressParams.color]?.hex ?? "#b8336a";

  // ── Background gradient ──
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#fff8f9");
  bg.addColorStop(0.4, "#ffffff");
  bg.addColorStop(1, lighten(mainColor, 0.92));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Decorative circle ──
  ctx.beginPath();
  ctx.arc(W / 2, 440, 180, 0, Math.PI * 2);
  ctx.fillStyle = lighten(mainColor, 0.88);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(W / 2, 440, 140, 0, Math.PI * 2);
  ctx.fillStyle = lighten(mainColor, 0.82);
  ctx.fill();

  // ── Dress silhouette (simplified) ──
  drawDressSilhouette(ctx, result, mainColor);

  // ── Eyebrow ──
  ctx.font = "600 14px 'DM Sans', sans-serif";
  ctx.fillStyle = "#929292";
  ctx.textAlign = "center";
  ctx.letterSpacing = "3px";
  ctx.fillText("YOUR CHARACTER", W / 2, 700);
  ctx.letterSpacing = "0px";

  // ── Character name ──
  ctx.font = "italic 500 52px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = mainColor;
  ctx.fillText(result.characterName, W / 2, 760);

  // ── Dress name ──
  ctx.font = "500 32px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = "#222222";
  ctx.fillText(`in ${result.name}`, W / 2, 808);

  // ── Tagline ──
  ctx.font = "italic 400 20px 'DM Sans', sans-serif";
  ctx.fillStyle = "#6a6a6a";
  const tagline = `"${result.tagline}"`;
  wrapText(ctx, tagline, W / 2, 860, W - 120, 28);

  // ── Palette swatches ──
  const swatchY = 940;
  const swatchR = 20;
  const totalW = result.palette.length * (swatchR * 2 + 12) - 12;
  let sx = (W - totalW) / 2 + swatchR;
  for (const c of result.palette) {
    ctx.beginPath();
    ctx.arc(sx, swatchY, swatchR, 0, Math.PI * 2);
    ctx.fillStyle = c.hex;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = "400 12px 'DM Sans', sans-serif";
    ctx.fillStyle = "#929292";
    ctx.fillText(c.label, sx, swatchY + 36);

    sx += swatchR * 2 + 12;
  }

  // ── Vibe words ──
  const vibeY = 1020;
  ctx.font = "500 15px 'DM Sans', sans-serif";
  ctx.fillStyle = mainColor;
  const vibeStr = result.vibeWords.join("  ·  ");
  ctx.fillText(vibeStr, W / 2, vibeY);

  // ── Size badge ──
  ctx.font = "600 14px 'DM Sans', sans-serif";
  ctx.fillStyle = "#6a6a6a";
  ctx.fillText(`Size ${result.size}`, W / 2, vibeY + 40);

  // ── Details pills ──
  const detailY = vibeY + 80;
  ctx.font = "400 13px 'DM Sans', sans-serif";
  const detailStr = result.details.slice(0, 5).join("  ·  ");
  ctx.fillStyle = "#929292";
  ctx.fillText(detailStr, W / 2, detailY);

  // ── Branding ──
  ctx.font = "600 22px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = "#222222";
  ctx.fillText("Style", W / 2 - 26, H - 60);
  ctx.fillStyle = mainColor;
  ctx.fillText("Sift", W / 2 + 26, H - 60);
  ctx.font = "400 12px 'DM Sans', sans-serif";
  ctx.fillStyle = "#929292";
  ctx.fillText("stylesift.netlify.app", W / 2, H - 34);

  // ── Border ──
  ctx.strokeStyle = "rgba(0,0,0,0.06)";
  ctx.lineWidth = 2;
  roundRect(ctx, 16, 16, W - 32, H - 32, 24);
  ctx.stroke();

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))), "image/png");
  });
}

export async function shareCard(result: DressResult) {
  try {
    const blob = await generateShareCard(result);
    const file = new File([blob], "stylesift-dress.png", { type: "image/png" });
    const text = `I'm ${result.characterName} in ${result.name} — "${result.tagline}" ✦ Made on StyleSift`;

    const nav = navigator as Navigator & { share?: (d: ShareData & { files?: File[] }) => Promise<void>; canShare?: (d: ShareData & { files?: File[] }) => boolean };

    if (nav.share && nav.canShare?.({ files: [file] })) {
      await nav.share({ title: "My StyleSift dress", text, files: [file] });
    } else if (nav.share) {
      await nav.share({ title: "My StyleSift dress", text });
    } else {
      // Fallback: download the image
      downloadBlob(blob, "stylesift-dress.png");
    }
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      // Fallback to text copy
      const text = `I'm ${result.characterName} in ${result.name} — "${result.tagline}" ✦ Made on StyleSift`;
      try { await navigator.clipboard.writeText(text); } catch {}
    }
  }
}

// ─── Helpers ──────────────────────────────────────

function drawDressSilhouette(ctx: CanvasRenderingContext2D, result: DressResult, color: string) {
  const cx = W / 2;
  const dressTop = 280;
  const dressBot = 660;
  const waist = dressTop + (dressBot - dressTop) * 0.35;
  const hipFlare = 90;

  // Head
  ctx.beginPath();
  ctx.arc(cx, dressTop - 40, 22, 0, Math.PI * 2);
  ctx.fillStyle = "#e8c4a0";
  ctx.fill();

  // Hair
  ctx.beginPath();
  ctx.arc(cx, dressTop - 48, 24, Math.PI, 2 * Math.PI);
  ctx.fillStyle = "#2a1810";
  ctx.fill();

  // Dress body
  ctx.beginPath();
  ctx.moveTo(cx - 30, dressTop);
  ctx.quadraticCurveTo(cx - 24, waist, cx - hipFlare, dressBot);
  ctx.lineTo(cx + hipFlare, dressBot);
  ctx.quadraticCurveTo(cx + 24, waist, cx + 30, dressTop);
  ctx.closePath();

  const dressGrad = ctx.createLinearGradient(0, dressTop, 0, dressBot);
  dressGrad.addColorStop(0, color);
  dressGrad.addColorStop(1, lighten(color, 0.3));
  ctx.fillStyle = dressGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Neckline accent
  ctx.beginPath();
  ctx.moveTo(cx - 28, dressTop);
  ctx.quadraticCurveTo(cx, dressTop + 18, cx + 28, dressTop);
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Waist line
  ctx.beginPath();
  ctx.moveTo(cx - 26, waist);
  ctx.quadraticCurveTo(cx, waist + 4, cx + 26, waist);
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Slit
  if (result.dressParams.slit === "side" || result.dressParams.slit === "high") {
    const slitTop = result.dressParams.slit === "high" ? waist + 20 : waist + 60;
    ctx.beginPath();
    ctx.moveTo(cx + hipFlare, dressBot);
    ctx.lineTo(cx + hipFlare - 20, slitTop);
    ctx.strokeStyle = lighten(color, 0.5);
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (result.dressParams.slit === "front") {
    ctx.beginPath();
    ctx.moveTo(cx, dressBot);
    ctx.lineTo(cx, waist + 40);
    ctx.strokeStyle = lighten(color, 0.5);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number) {
  const words = text.split(" ");
  let line = "";
  let ly = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, ly);
      line = word;
      ly += lineH;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, ly);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
}
