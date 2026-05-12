import { Wordmark } from "./_chrome";

interface HomeProps {
  onBegin: () => void;
  onAdmin: () => void;
}

export function Home({ onBegin, onAdmin }: HomeProps) {
  return (
    <main className="flex flex-1 flex-col px-5 pb-6 pt-6">
      <div className="flex items-center justify-between">
        <Wordmark />
        <span className="eyebrow">no login · no fuss</span>
      </div>

      {/* Hero */}
      <section className="mt-6 rise rise-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-tint via-canvas to-surface-soft p-6">
        <div className="flex justify-center pb-2">
          <HeroIllustration />
        </div>
        <p className="eyebrow mt-2 text-center">No filters. No rules.</p>
        <h1 className="display-h1 mt-2 text-center">
          The dress that <em className="not-italic text-primary">knows</em> you back.
        </h1>
        <p className="body-lg mt-3 text-center text-body">
          Tell us the night you're imagining. We'll hand you the dress —
          and the woman wearing it.
        </p>
      </section>

      {/* Social proof */}
      <section className="mt-5 rise rise-2 grid grid-cols-3 gap-2 text-center">
        <Pill big="2,400+" small="dresses revealed" />
        <Pill big="11" small="silhouettes" />
        <Pill big="60s" small="to find yours" />
      </section>

      {/* Encouragement */}
      <section className="mt-7 rise rise-3">
        <p className="text-[15px] leading-relaxed text-body">
          Stop scrolling someone else's wardrobe.
          <br />
          <span className="font-semibold text-ink">Find the one that's already yours.</span>
        </p>
      </section>

      {/* Single CTA */}
      <div className="mt-auto pt-8 rise rise-4">
        <button
          type="button"
          onClick={onBegin}
          className="btn-primary w-full !h-14 !text-[16px]"
        >
          Begin — find my dress ✦
        </button>
        <p className="mt-3 text-center text-[12px] text-muted-soft">
          Anonymous by design · ~60 seconds
        </p>
        <button
          type="button"
          onClick={onAdmin}
          className="mt-5 block mx-auto text-[12px] text-muted-soft underline underline-offset-2 opacity-50 hover:opacity-100 transition-opacity"
        >
          Admin
        </button>
      </div>
    </main>
  );
}

function Pill({ big, small }: { big: string; small: string }) {
  return (
    <div className="rounded-lg bg-surface-soft px-2 py-3">
      <p className="font-display text-[20px] font-semibold leading-none text-ink">{big}</p>
      <p className="mt-1 text-[10.5px] leading-tight text-muted">{small}</p>
    </div>
  );
}

function HeroIllustration() {
  return (
    <svg width="180" height="200" viewBox="0 0 180 200" aria-hidden>
      <defs>
        <linearGradient id="dressGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b8336a" stopOpacity="0.95" />
          <stop offset="1" stopColor="#f4d4e0" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd86b" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd86b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="90" cy="40" r="60" fill="url(#halo)" />
      <g fill="#b8336a">
        <circle cx="30" cy="30" r="2" />
        <circle cx="155" cy="50" r="1.5" />
        <circle cx="20" cy="100" r="1.2" />
        <circle cx="160" cy="130" r="1.8" />
        <circle cx="40" cy="160" r="1.2" />
      </g>
      <path d="M75 22 Q 70 15 90 12 Q 110 15 105 22 L 108 38 Q 105 32 90 32 Q 75 32 72 38 Z" fill="#3a2618" />
      <ellipse cx="90" cy="32" rx="11" ry="13" fill="#e9c9a8" />
      <rect x="86" y="42" width="8" height="6" fill="#e9c9a8" />
      <path d="M68 50 Q 72 52 82 56 L 82 90 Q 76 92 70 90 Z" fill="#e9c9a8" />
      <path d="M112 50 Q 108 52 98 56 L 98 90 Q 104 92 110 90 Z" fill="#e9c9a8" />
      <path
        d="M82 50 L 98 50 L 102 58 L 110 80 L 130 180 L 50 180 L 70 80 L 78 58 Z"
        fill="url(#dressGrad)"
      />
      <path d="M82 50 Q 90 58 98 50" fill="none" stroke="#3a2618" strokeWidth="0.8" opacity="0.4" />
      <path d="M70 92 Q 90 96 110 92" fill="none" stroke="#3a2618" strokeWidth="0.6" opacity="0.3" />
      <ellipse cx="90" cy="186" rx="40" ry="3" fill="#3a2618" opacity="0.1" />
    </svg>
  );
}
