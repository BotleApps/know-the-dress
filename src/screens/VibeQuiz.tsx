import { useMemo, useState } from "react";
import {
  COLORS,
  MOODS,
  OCCASIONS,
  SEASONS,
  type Color,
  type Mood,
  type Occasion,
  type Season,
  type VibeAnswers,
} from "../lib/dress";
import { ChoiceChip, FooterCTA, Header } from "./_chrome";

interface VibeQuizProps {
  onBack: () => void;
  onComplete: (answers: VibeAnswers) => void;
}

type Step = 0 | 1 | 2 | 3;

export function VibeQuiz({ onBack, onComplete }: VibeQuizProps) {
  const [step, setStep] = useState<Step>(0);
  const [mood, setMood] = useState<Mood | null>(null);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [color, setColor] = useState<Color | null>(null);
  const [season, setSeason] = useState<Season | null>(null);

  const total = 4;
  const current = step + 1;

  const ready = useMemo(() => {
    if (step === 0) return mood !== null;
    if (step === 1) return occasion !== null;
    if (step === 2) return color !== null;
    return season !== null;
  }, [step, mood, occasion, color, season]);

  const next = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
    else if (mood && occasion && color && season) onComplete({ mood, occasion, color, season });
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
          <Step
            eyebrow="The vibe"
            title="What's the energy you're chasing?"
            help="Pick the one that feels closest. Trust your gut."
          >
            <div className="grid grid-cols-2 gap-3">
              {MOODS.map((m) => (
                <MoodTile
                  key={m.id}
                  active={mood === m.id}
                  onClick={() => setMood(m.id)}
                  label={m.label}
                  hint={m.hint}
                  emoji={m.emoji}
                />
              ))}
            </div>
          </Step>
        )}

        {step === 1 && (
          <Step
            eyebrow="The occasion"
            title="Where are you wearing it?"
            help="One pick — the dress will know what to do."
          >
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <ChoiceChip key={o.id} active={occasion === o.id} onClick={() => setOccasion(o.id)}>
                  {o.label}
                </ChoiceChip>
              ))}
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step
            eyebrow="The colour"
            title="Pick the colour you keep coming back to."
          >
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-4">
              {(Object.keys(COLORS) as Color[]).map((c) => {
                const meta = COLORS[c];
                const active = color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="flex flex-col items-center gap-2"
                  >
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
          </Step>
        )}

        {step === 3 && (
          <Step
            eyebrow="The season"
            title="When is this happening?"
            help="So we send you into the right fabric weight."
          >
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => (
                <ChoiceChip key={s.id} active={season === s.id} onClick={() => setSeason(s.id)}>
                  {s.label}
                </ChoiceChip>
              ))}
            </div>
          </Step>
        )}
      </div>

      <FooterCTA
        primaryLabel={step === 3 ? "Reveal my dress" : "Continue"}
        onPrimary={next}
        primaryDisabled={!ready}
      />
    </main>
  );
}

function Step({
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

function MoodTile({
  active,
  onClick,
  label,
  hint,
  emoji,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint: string;
  emoji: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-32 flex-col justify-between rounded-md border p-4 text-left transition-all duration-150 ease-out active:scale-[0.99] ${
        active
          ? "border-ink bg-primary-tint"
          : "border-hairline bg-surface-soft hover:border-ink/40"
      }`}
    >
      <span className={`text-xl ${active ? "text-primary" : "text-ink"}`}>{emoji}</span>
      <div>
        <div className="text-[16px] font-medium text-ink">{label}</div>
        <div className="text-[12px] leading-tight text-muted">{hint}</div>
      </div>
    </button>
  );
}
