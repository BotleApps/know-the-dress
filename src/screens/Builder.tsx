import { useMemo, useState } from "react";
import {
  COLORS,
  FABRICS,
  LENGTHS,
  NECKLINES,
  SLEEVES,
  SLITS,
  type BuilderAnswers,
  type Color,
  type Fabric,
  type Length,
  type Neckline,
  type Sleeve,
  type Slit,
} from "../lib/dress";
import { ChoiceChip, FooterCTA, Header } from "./_chrome";

interface BuilderProps {
  onBack: () => void;
  onComplete: (answers: BuilderAnswers) => void;
}

type Field = keyof BuilderAnswers;

const STEPS: { field: Field; eyebrow: string; title: string; help?: string }[] = [
  { field: "neckline", eyebrow: "Neckline", title: "How do you want it to sit at the top?" },
  { field: "length",   eyebrow: "Length",   title: "Where should it land?" },
  { field: "fabric",   eyebrow: "Fabric",   title: "What should it feel like in your hand?" },
  { field: "sleeve",   eyebrow: "Sleeves",  title: "What about the arms?" },
  { field: "slit",     eyebrow: "Slit",     title: "Should it open up when you walk?" },
  { field: "color",    eyebrow: "Colour",   title: "And the colour?" },
];

export function Builder({ onBack, onComplete }: BuilderProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<BuilderAnswers>>({});

  const total = STEPS.length;
  const current = step + 1;
  const def = STEPS[step];
  const value = answers[def.field];
  const ready = value !== undefined;

  const next = () => {
    if (step < total - 1) setStep((s) => s + 1);
    else if (isComplete(answers)) onComplete(answers);
  };

  const back = () => {
    if (step === 0) onBack();
    else setStep((s) => s - 1);
  };

  const set = <K extends Field>(field: K, v: BuilderAnswers[K]) =>
    setAnswers((a) => ({ ...a, [field]: v }));

  const options = useMemo(() => {
    switch (def.field) {
      case "neckline": return NECKLINES;
      case "length":   return LENGTHS;
      case "fabric":   return FABRICS;
      case "sleeve":   return SLEEVES;
      case "slit":     return SLITS;
      case "color":    return Object.keys(COLORS) as Color[];
    }
  }, [def.field]);

  return (
    <main className="flex flex-1 flex-col px-5 pb-6">
      <Header onBack={back} step={{ current, total }} />

      <section className="pt-2 rise rise-1" key={step}>
        <p className="eyebrow">{def.eyebrow}</p>
        <h2 className="display-h2 mt-2">{def.title}</h2>
        {def.help && <p className="body-sm mt-2 text-muted">{def.help}</p>}

        <div className="mt-6">
          {def.field === "color" ? (
            <div className="grid grid-cols-4 gap-4">
              {(options as Color[]).map((c) => {
                const meta = COLORS[c];
                const active = answers.color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("color", c)}
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
          ) : (
            <div className="flex flex-wrap gap-2">
              {(options as string[]).map((opt) => {
                const active = answers[def.field] === opt;
                return (
                  <ChoiceChip
                    key={opt}
                    active={active}
                    onClick={() =>
                      set(def.field as Exclude<Field, "color">, opt as Neckline & Length & Fabric & Sleeve & Slit)
                    }
                    variant="accent"
                  >
                    {opt}
                  </ChoiceChip>
                );
              })}
            </div>
          )}
        </div>

        <BuilderPreview answers={answers} />
      </section>

      <FooterCTA
        primaryLabel={step === total - 1 ? "Reveal my dress" : "Continue"}
        onPrimary={next}
        primaryDisabled={!ready}
      />
    </main>
  );
}

function isComplete(a: Partial<BuilderAnswers>): a is BuilderAnswers {
  return (
    !!a.neckline && !!a.length && !!a.fabric && !!a.sleeve && !!a.slit && !!a.color
  );
}

function BuilderPreview({ answers }: { answers: Partial<BuilderAnswers> }) {
  const items: { label: string; value?: string }[] = [
    { label: "Neckline", value: answers.neckline },
    { label: "Length",   value: answers.length },
    { label: "Fabric",   value: answers.fabric },
    { label: "Sleeves",  value: answers.sleeve },
    { label: "Slit",     value: answers.slit },
    { label: "Colour",   value: answers.color ? COLORS[answers.color].label : undefined },
  ];

  return (
    <div className="mt-8 rounded-md border border-hairline-soft bg-surface-soft p-4">
      <p className="eyebrow mb-3">Your dress so far</p>
      <dl className="grid grid-cols-2 gap-y-2 text-[14px]">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between pr-3">
            <dt className="text-muted">{it.label}</dt>
            <dd className={it.value ? "text-ink font-medium" : "text-muted-soft"}>
              {it.value ?? "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
