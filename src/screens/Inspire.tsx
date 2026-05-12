import { Header } from "./_chrome";

interface InspireProps {
  onBack: () => void;
  onPickVibe: () => void;
  onPickBuilder: () => void;
}

export function Inspire({ onBack, onPickVibe, onPickBuilder }: InspireProps) {
  return (
    <main className="flex flex-1 flex-col px-5 pb-6">
      <Header onBack={onBack} title="" />

      {/* Hero */}
      <section className="mt-2 rise rise-1">
        <p className="eyebrow">Before you begin</p>
        <h1 className="display-h1 mt-3">
          Be the woman you've <em className="not-italic text-primary">already imagined.</em>
        </h1>
        <p className="body-lg mt-4 max-w-[34ch] text-body">
          Forget the trend feeds. The right dress isn't the one most-liked —
          it's the one that says <span className="italic">"yes, that's her."</span>
        </p>
      </section>

      {/* Stats / proof strip */}
      <section className="mt-8 rise rise-2">
        <div className="grid grid-cols-3 gap-3">
          <Stat number="73%" label="of women feel different in a dress they actually chose" />
          <Stat number="11" silhouettes label="silhouettes from soft to dramatic" />
          <Stat number="60s" label="to find yours — promise" />
        </div>
      </section>

      {/* Manifesto */}
      <section className="mt-8 rise rise-3">
        <ol className="space-y-4">
          <Manifesto
            n="01"
            title="Pick the feeling first"
            body="Confidence, softness, mischief — the silhouette will follow."
          />
          <Manifesto
            n="02"
            title="Trust your gut"
            body="The first one that makes you smile is usually the one."
          />
          <Manifesto
            n="03"
            title="Meet your character"
            body="Every dress comes with the woman wearing it. She might surprise you."
          />
        </ol>
      </section>

      {/* Path picker */}
      <section className="mt-10 rise rise-4">
        <p className="eyebrow">Choose your path</p>
        <div className="mt-4 grid gap-3">
          <button
            type="button"
            onClick={onPickVibe}
            className="group flex items-center justify-between rounded-md border border-hairline-soft bg-primary-tint p-5 text-left transition-all duration-200 ease-out active:scale-[0.99]"
          >
            <div>
              <p className="display-h2">Find my vibe</p>
              <p className="body-sm mt-1 text-body">5 soft questions · we pick the dress</p>
            </div>
            <Arrow />
          </button>
          <button
            type="button"
            onClick={onPickBuilder}
            className="group flex items-center justify-between rounded-md border border-hairline-soft bg-surface-soft p-5 text-left transition-all duration-200 ease-out active:scale-[0.99]"
          >
            <div>
              <p className="display-h2">Build my dress</p>
              <p className="body-sm mt-1 text-body">7 details · you design the silhouette</p>
            </div>
            <Arrow />
          </button>
        </div>
      </section>

      <div className="mt-auto pt-8 rise rise-4">
        <p className="text-center text-[12px] italic text-muted">
          "She wore it like she'd always known."
        </p>
      </div>
    </main>
  );
}

function Stat({ number, label, silhouettes }: { number: string; label: string; silhouettes?: boolean }) {
  return (
    <div className="rounded-lg bg-surface-soft p-3 text-center">
      <p className="font-display text-[28px] font-semibold leading-none text-ink">
        {number}
        {silhouettes && <span className="text-primary">+</span>}
      </p>
      <p className="mt-2 text-[10.5px] leading-snug text-muted">{label}</p>
    </div>
  );
}

function Manifesto({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="flex items-start gap-4">
      <span className="font-display text-[22px] font-medium text-primary leading-none mt-0.5">{n}</span>
      <div>
        <p className="text-[15px] font-semibold text-ink">{title}</p>
        <p className="body-sm mt-1 text-muted">{body}</p>
      </div>
    </li>
  );
}

function Arrow() {
  return (
    <span
      aria-hidden
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </span>
  );
}
