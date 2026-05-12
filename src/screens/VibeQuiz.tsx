import { useMemo, useState } from "react";
import {
  COLORS,
  MOODS,
  OCCASIONS,
  SEASONS,
  SIZES,
  type Color,
  type Mood,
  type Occasion,
  type Season,
  type Size,
  type VibeAnswers,
} from "../lib/dress";
import { MoodIcon, OccasionIcon, SeasonIcon } from "../lib/icons";
import { FooterCTA, Header } from "./_chrome";
import { logEvent } from "../lib/log";

interface VibeQuizProps {
  onBack: () => void;
  onComplete: (answers: VibeAnswers) => void;
}

type Step = 0 | 1 | 2 | 3 | 4;

export function VibeQuiz({ onBack, onComplete }: VibeQuizProps) {
  const [step, setStep] = useState<Step>(0);
  const [mood, setMood] = useState<Mood | null>(null);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [color, setColor] = useState<Color | null>(null);
  const [season, setSeason] = useState<Season | null>(null);
  const [size, setSize] = useState<Size | null>(null);

  const total = 5;
  const current = step + 1;

  const ready = useMemo(() => {
    if (step === 0) return mood !== null;
    if (step === 1) return occasion !== null;
    if (step === 2) return color !== null;
    if (step === 3) return season !== null;
    return size !== null;
  }, [step, mood, occasion, color, season, size]);

  const next = () => {
    // Log the choice for this step
    const fields = ["mood", "occasion", "color", "season", "size"] as const;
    const values = [mood, occasion, color, season, size];
    const field = fields[step];
    const value = values[step];
    if (value) logEvent("selection", { via: "vibe", field, value, step: step + 1 });

    if (step < 4) setStep((s) => (s + 1) as Step);
    else if (mood && occasion && color && season && size)
      onComplete({ mood, occasion, color, season, size });
  };

  const back = () => {
    if (step === 0) onBack();
    else setStep((s) => (s - 1) as Step);
  };

  return (
    <main className="flex flex-1 flex-col px-5 pb-6">
      <Header onBack={back} step={{ current, total }} />

      <div className="mt-2 rise rise-1" key={step}>
        {step === 0 && (
          <StepShell eyebrow="The vibe" title="What energy are you chasing?" help="Pick the one that feels closest.">
            <div className="grid grid-cols-2 gap-3">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`flex flex-col items-center gap-2 rounded-md border p-4 text-center transition-all duration-150 ease-out active:scale-[0.98] ${
                    mood === m.id
                      ? "border-ink bg-primary-tint shadow-soft"
                      : "border-hairline bg-surface-soft"
                  }`}
                >
                  <MoodIcon mood={m.id} />
                  <span className="text-[15px] font-medium text-ink">{m.label}</span>
                  <span className="text-[12px] leading-tight text-muted">{m.hint}</span>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell eyebrow="The occasion" title="Where are you wearing it?" help="One pick — the dress will know what to do.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {OCCASIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOccasion(o.id)}
                  className={`flex flex-col items-center gap-2 rounded-md border px-3 py-4 text-center transition-all duration-150 ease-out active:scale-[0.98] ${
                    occasion === o.id
                      ? "border-ink bg-primary-tint shadow-soft"
                      : "border-hairline bg-surface-soft"
                  }`}
                >
                  <OccasionIcon occasion={o.id} />
                  <span className="text-[14px] font-medium text-ink">{o.label}</span>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell eyebrow="The colour" title="Pick the colour you keep coming back to.">
            <div className="grid grid-cols-4 gap-4">
              {(Object.keys(COLORS) as Color[]).map((c) => {
                const meta = COLORS[c];
                const active = color === c;
                return (
                  <button key={c} type="button" onClick={() => setColor(c)} className="flex flex-col items-center gap-2">
                    <span
                      className={`swatch ${active ? "swatch-active" : ""}`}
                      style={{ background: meta.hex }}
                      aria-label={meta.label}
                    />
                    <span className={`text-[12px] ${active ? "text-ink font-medium" : "text-muted"}`}>
                      {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell eyebrow="The season" title="When is this happening?" help="So we send you into the right fabric weight.">
            <div className="grid grid-cols-2 gap-3">
              {SEASONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSeason(s.id)}
                  className={`flex flex-col items-center gap-2 rounded-md border px-4 py-5 text-center transition-all duration-150 ease-out active:scale-[0.98] ${
                    season === s.id
                      ? "border-ink bg-primary-tint shadow-soft"
                      : "border-hairline bg-surface-soft"
                  }`}
                >
                  <SeasonIcon season={s.id} />
                  <span className="text-[15px] font-medium text-ink">{s.label}</span>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell eyebrow="Your size" title="What size feels like you?" help="So we know the right fit.">
            <div className="grid grid-cols-3 gap-3">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`flex h-16 items-center justify-center rounded-md border text-center transition-all duration-150 ease-out active:scale-[0.98] ${
                    size === s
                      ? "border-ink bg-primary-tint shadow-soft"
                      : "border-hairline bg-surface-soft"
                  }`}
                >
                  <span className="font-display text-[20px] font-medium text-ink">{s}</span>
                </button>
              ))}
            </div>
          </StepShell>
        )}
      </div>

      <FooterCTA
        primaryLabel={step === 4 ? "Reveal my dress ✦" : "Continue"}
        onPrimary={next}
        primaryDisabled={!ready}
      />
    </main>
  );
}

function StepShell({
  eyebrow,
  title,
  help,
  children,
}: {
  eyebrow: string;
  title: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-2">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display-h2 mt-2">{title}</h2>
      {help && <p className="body-sm mt-2 text-muted">{help}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
