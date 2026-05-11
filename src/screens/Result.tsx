import { useEffect, useState } from "react";
import type { DressResult } from "../lib/dress";
import { Header } from "./_chrome";
import { logEvent } from "../lib/log";

interface ResultProps {
  result: DressResult;
  via: "vibe" | "builder";
  onRestart: () => void;
  onTryOther: () => void;
}

export function Result({ result, via, onRestart, onTryOther }: ResultProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 480);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="flex flex-1 flex-col px-5 pb-6">
      <Header onBack={onRestart} title="Your match" />

      {!revealed ? (
        <div className="mt-10 space-y-4">
          <div className="shimmer h-6 w-2/3 rounded-full" />
          <div className="shimmer h-12 w-11/12 rounded-md" />
          <div className="shimmer mt-6 h-72 w-full rounded-md" />
        </div>
      ) : (
        <article className="pt-2">
          <section className="rise rise-1">
            <p className="eyebrow">Your character</p>
            <h1 className="display-h1 mt-2">
              <span className="text-primary">{result.characterName}</span>
              <span className="text-ink">, in {result.name}.</span>
            </h1>
            <p className="body-lg mt-3 italic text-body">"{result.tagline}"</p>
          </section>

          <section className="mt-8 rise rise-2">
            <DressIllustration palette={result.palette} />
          </section>

          <section className="mt-8 rise rise-3">
            <p className="eyebrow">The silhouette</p>
            <p className="body-lg mt-2 text-ink">{result.silhouette}</p>
          </section>

          <section className="mt-8 rise rise-3">
            <p className="eyebrow">The details</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {result.details.map((d) => (
                <li
                  key={d}
                  className="rounded-sm border border-hairline-soft bg-surface-soft px-3 py-2 text-[13px] text-ink"
                >
                  {d}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rise rise-4">
            <p className="eyebrow">The palette</p>
            <div className="mt-3 flex items-center gap-4">
              {result.palette.map((c) => (
                <div key={c.label} className="flex flex-col items-center gap-1.5">
                  <span
                    className="h-12 w-12 rounded-full ring-1 ring-inset ring-hairline"
                    style={{ background: c.hex }}
                  />
                  <span className="text-[12px] text-muted">{c.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rise rise-4">
            <p className="eyebrow">Style with</p>
            <ul className="mt-3 space-y-2">
              {result.pairings.map((p) => (
                <li key={p} className="body-lg text-ink">
                  · {p}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rise rise-4">
            <p className="eyebrow">She is</p>
            <p className="mt-3 flex flex-wrap gap-2">
              {result.vibeWords.map((w) => (
                <span
                  key={w}
                  className="rounded-full bg-primary-soft px-3 py-1 text-[13px] font-medium text-primary"
                >
                  {w}
                </span>
              ))}
            </p>
          </section>

          <div className="mt-10 grid gap-3 pb-2">
            <button
              type="button"
              className="btn-accent"
              onClick={() => {
                logEvent("share_intent", { name: result.name });
                share(result);
              }}
            >
              Share my dress
            </button>
            <button type="button" className="btn-secondary" onClick={onTryOther}>
              Try the {via === "vibe" ? "builder" : "vibe quiz"}
            </button>
            <button type="button" className="btn-ghost" onClick={onRestart}>
              Start over
            </button>
          </div>
        </article>
      )}
    </main>
  );
}

function share(result: DressResult) {
  const text = `I'm ${result.characterName} in ${result.name} — "${result.tagline}". Made on StyleSift.`;
  const url = typeof location !== "undefined" ? location.href : "";
  const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
  if (nav.share) {
    nav.share({ title: "My StyleSift dress", text, url }).catch(() => copy(text + " " + url));
  } else {
    copy(text + " " + url);
  }
}

function copy(text: string) {
  try {
    navigator.clipboard.writeText(text);
  } catch {
    // ignore
  }
}

function DressIllustration({ palette }: { palette: { hex: string; label: string }[] }) {
  const main = palette[0]?.hex ?? "#b8336a";
  const accent = palette[1]?.hex ?? "#222";
  return (
    <div className="relative mx-auto flex h-72 w-full items-center justify-center rounded-md bg-gradient-to-b from-primary-tint to-surface-soft">
      <svg width="180" height="240" viewBox="0 0 180 240" aria-hidden>
        <defs>
          <linearGradient id="dress" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={main} stopOpacity="0.95" />
            <stop offset="1" stopColor={main} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {/* head */}
        <circle cx="90" cy="32" r="18" fill="#222" />
        {/* shoulders */}
        <path
          d="M60 56 Q90 48 120 56 L130 78 Q90 82 50 78 Z"
          fill={accent}
          opacity="0.9"
        />
        {/* body */}
        <path
          d="M52 78 C 30 150 22 220 18 232 L 162 232 C 158 220 150 150 128 78 Z"
          fill="url(#dress)"
        />
        {/* hem detail */}
        <path d="M18 232 L 162 232" stroke="#222" strokeWidth="1" />
        {/* slit */}
        <path d="M90 130 L 90 230" stroke="#222" strokeOpacity="0.18" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
