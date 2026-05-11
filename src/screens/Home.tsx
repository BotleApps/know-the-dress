import { Wordmark } from "./_chrome";

interface HomeProps {
  onPickVibe: () => void;
  onPickBuilder: () => void;
  onAdmin: () => void;
}

export function Home({ onPickVibe, onPickBuilder, onAdmin }: HomeProps) {
  return (
    <main className="flex flex-1 flex-col px-5 pb-6 pt-6">
      <div className="flex items-center justify-between">
        <Wordmark />
        <span className="eyebrow">no login · no fuss</span>
      </div>

      <section className="mt-10 rise rise-1">
        <p className="eyebrow">Find your dress, your way</p>
        <h1 className="display-h1 mt-3">
          The dress that <em className="not-italic text-primary">matches</em> the night you're imagining.
        </h1>
        <p className="body-lg mt-4 max-w-[36ch]">
          Tell us the vibe, or design the silhouette yourself. We'll sift the
          shapes, fabrics and colours and hand you back one perfect dress —
          and a name for the woman wearing it.
        </p>
      </section>

      <section className="mt-10 grid gap-4 rise rise-2">
        <PathCard
          title="Find my vibe"
          subtitle="Four soft questions. We pick the silhouette."
          duration="≈ 45s"
          accent
          onClick={onPickVibe}
          art={<VibeArt />}
        />
        <PathCard
          title="Build my dress"
          subtitle="Pick neckline, length, fabric, sleeves & slit."
          duration="≈ 60s"
          onClick={onPickBuilder}
          art={<BuilderArt />}
        />
      </section>

      <div className="mt-auto pt-10 rise rise-3">
        <p className="body-sm text-muted-soft">
          Anonymous by design. We never ask for your name — but we do remember
          this device so we can keep getting better.
        </p>
        <button
          type="button"
          onClick={onAdmin}
          className="mt-4 text-[12px] text-muted-soft underline underline-offset-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          Admin dashboard
        </button>
      </div>
    </main>
  );
}

interface PathCardProps {
  title: string;
  subtitle: string;
  duration: string;
  onClick: () => void;
  accent?: boolean;
  art: React.ReactNode;
}

function PathCard({ title, subtitle, duration, onClick, accent, art }: PathCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-md border border-hairline-soft p-5 text-left transition-all duration-200 ease-out active:scale-[0.99] ${
        accent ? "bg-primary-tint" : "bg-surface-soft"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{accent ? "Most popular" : "For the planners"}</p>
          <h3 className="display-h2 mt-2">{title}</h3>
          <p className="body-sm mt-2 text-body">{subtitle}</p>
          <p className="body-sm mt-3 text-muted">{duration}</p>
        </div>
        <div className="shrink-0">{art}</div>
      </div>
      <span
        aria-hidden
        className="absolute right-5 bottom-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white transition-transform duration-200 ease-out group-active:translate-x-0.5"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </span>
    </button>
  );
}

function VibeArt() {
  return (
    <svg width="86" height="100" viewBox="0 0 86 100" aria-hidden>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b8336a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#b8336a" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <circle cx="43" cy="14" r="10" fill="#222" />
      <path
        d="M43 24 C 28 30 22 50 18 90 L 68 90 C 64 50 58 30 43 24 Z"
        fill="url(#g1)"
      />
      <path d="M18 90 L 68 90" stroke="#222" strokeWidth="1.2" />
    </svg>
  );
}

function BuilderArt() {
  return (
    <svg width="86" height="100" viewBox="0 0 86 100" aria-hidden>
      <circle cx="43" cy="14" r="10" fill="#222" />
      <path
        d="M43 24 L 30 36 L 26 90 L 60 90 L 56 36 Z"
        fill="#f4ece1"
        stroke="#222"
        strokeWidth="1.4"
      />
      <path d="M43 24 L 43 90" stroke="#222" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="30" cy="36" r="2" fill="#b8336a" />
      <circle cx="56" cy="36" r="2" fill="#b8336a" />
      <circle cx="26" cy="90" r="2" fill="#b8336a" />
      <circle cx="60" cy="90" r="2" fill="#b8336a" />
    </svg>
  );
}
