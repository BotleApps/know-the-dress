import { useEffect, useState } from "react";
import type { DressResult } from "../lib/dress";
import { DressViz } from "../lib/dress-viz";
import { shareCard } from "../lib/share-card";
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
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(t);
  }, []);

  const handleShare = async () => {
    setSharing(true);
    logEvent("share_intent", { name: result.name });
    try {
      await shareCard(result);
    } finally {
      setSharing(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col px-5 pb-6">
      <Header onBack={onRestart} title="Your match" />

      {!revealed ? (
        <div className="mt-10 flex flex-col items-center gap-5">
          <div className="shimmer h-6 w-2/3 rounded-full" />
          <div className="shimmer h-12 w-11/12 rounded-md" />
          <div className="shimmer mt-4 h-80 w-56 rounded-md" />
          <div className="shimmer h-6 w-3/4 rounded-full" />
        </div>
      ) : (
        <article className="pt-2">
          {/* Character reveal */}
          <section className="rise rise-1 text-center">
            <p className="eyebrow">Your character</p>
            <h1 className="display-h1 mt-3">
              <span className="text-primary italic">{result.characterName}</span>
            </h1>
            <p className="font-display text-[20px] text-ink mt-1" style={{ fontWeight: 500 }}>
              in {result.name}
            </p>
            <p className="body-lg mt-3 italic text-body max-w-[32ch] mx-auto">
              "{result.tagline}"
            </p>
          </section>

          {/* Dress illustration — the hero */}
          <section className="mt-8 rise rise-2">
            <div className="relative mx-auto flex w-full items-center justify-center rounded-xl bg-gradient-to-b from-primary-tint via-white to-surface-soft py-8">
              <DressViz params={result.dressParams} width={220} height={380} />
              {/* Size badge */}
              <span className="absolute top-4 right-4 rounded-full bg-ink px-3 py-1 text-[12px] font-semibold text-white">
                {result.size}
              </span>
            </div>
          </section>

          {/* Silhouette description */}
          <section className="mt-8 rise rise-3">
            <p className="eyebrow">The silhouette</p>
            <p className="body-lg mt-2 text-ink">{result.silhouette}</p>
          </section>

          {/* Details */}
          <section className="mt-8 rise rise-3">
            <p className="eyebrow">The details</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {result.details.map((d) => (
                <li key={d} className="rounded-sm border border-hairline-soft bg-surface-soft px-3 py-2 text-[13px] text-ink">
                  {d}
                </li>
              ))}
            </ul>
          </section>

          {/* Palette */}
          <section className="mt-8 rise rise-4">
            <p className="eyebrow">The palette</p>
            <div className="mt-3 flex items-center gap-4">
              {result.palette.map((c) => (
                <div key={c.label} className="flex flex-col items-center gap-1.5">
                  <span className="h-12 w-12 rounded-full ring-1 ring-inset ring-hairline" style={{ background: c.hex }} />
                  <span className="text-[12px] text-muted">{c.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Pairings */}
          <section className="mt-8 rise rise-4">
            <p className="eyebrow">Style with</p>
            <ul className="mt-3 space-y-2">
              {result.pairings.map((p) => (
                <li key={p} className="body-lg text-ink">· {p}</li>
              ))}
            </ul>
          </section>

          {/* Vibe words */}
          <section className="mt-8 rise rise-4">
            <p className="eyebrow">She is</p>
            <p className="mt-3 flex flex-wrap gap-2">
              {result.vibeWords.map((w) => (
                <span key={w} className="rounded-full bg-primary-soft px-3 py-1 text-[13px] font-medium text-primary">
                  {w}
                </span>
              ))}
            </p>
          </section>

          {/* Actions */}
          <div className="mt-10 grid gap-3 pb-2">
            <button
              type="button"
              className="btn-accent"
              onClick={handleShare}
              disabled={sharing}
            >
              {sharing ? "Creating card…" : "Share my vibe ✦"}
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
