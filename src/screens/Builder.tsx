import { useMemo, useState } from "react";
import {
  COLORS,
  FABRICS,
  LENGTHS,
  NECKLINES,
  SIZES,
  SLEEVES,
  SLITS,
  type BuilderAnswers,
  type Color,
  type Fabric,
  type Length,
  type Neckline,
  type Size,
  type Sleeve,
  type Slit,
} from "../lib/dress";
import { NecklineIcon, LengthIcon, FabricIcon, SleeveIcon, SlitIcon } from "../lib/icons";
import { FooterCTA, Header } from "./_chrome";

interface BuilderProps {
  onBack: () => void;
  onComplete: (answers: BuilderAnswers) => void;
}

type Field = keyof BuilderAnswers;

const STEPS: { field: Field; eyebrow: string; title: string }[] = [
  { field: "neckline", eyebrow: "Neckline", title: "How do you want it to sit at the top?" },
  { field: "length",   eyebrow: "Length",   title: "Where should it land?" },
  { field: "fabric",   eyebrow: "Fabric",   title: "What should it feel like?" },
  { field: "sleeve",   eyebrow: "Sleeves",  title: "What about the arms?" },
  { field: "slit",     eyebrow: "Slit",     title: "Should it open up when you walk?" },
  { field: "color",    eyebrow: "Colour",   title: "And the colour?" },
  { field: "size",     eyebrow: "Size",     title: "What size feels like you?" },
];

function IconFor({ field, value }: { field: Field; value: string }) {
  switch (field) {
    case "neckline": return <NecklineIcon neckline={value as Neckline} />;
    case "length":   return <LengthIcon length={value as Length} />;
    case "fabric":   return <FabricIcon fabric={value as Fabric} />;
    case "sleeve":   return <SleeveIcon sleeve={value as Sleeve} />;
    case "slit":     return <SlitIcon slit={value as Slit} />;
    default:         return null;
  }
}

export function Builder({ onBack, onComplete }: BuilderProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<BuilderAnswers>>({});

  const total = STEPS.length;
  const current = step + 1;
  const def = STEPS[step];
  const ready = answers[def.field] !== undefined;

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

  const options = useMemo((): string[] => {
    switch (def.field) {
      case "neckline": return NECKLINES;
      case "length":   return LENGTHS;
      case "fabric":   return FABRICS;
      case "sleeve":   return SLEEVES;
      case "slit":     return SLITS;
      case "color":    return Object.keys(COLORS) as Color[];
      case "size":     return SIZES;
    }
  }, [def.field]);

  const hasIllustration = ["neckline", "length", "fabric", "sleeve", "slit"].includes(def.field);

  return (
    <main className="flex flex-1 flex-col px-5 pb-6">
      <Header onBack={back} step={{ current, total }} />

      <section className="pt-2 rise rise-1" key={step}>
        <p className="eyebrow">{def.eyebrow}</p>
        <h2 className="display-h2 mt-2">{def.title}</h2>

        <div className="mt-6">
          {def.field === "color" ? (
            <div className="grid grid-cols-4 gap-4">
              {(options as Color[]).map((c) => {
                const meta = COLORS[c];
                const active = answers.color === c;
                return (
                  <button key={c} type="button" onClick={() => set("color", c)} className="flex flex-col items-center gap-2">
                    <span className={`swatch ${active ? "swatch-active" : ""}`} style={{ background: meta.hex }} aria-label={meta.label} />
                    <span className={`text-[12px] ${active ? "text-ink font-medium" : "text-muted"}`}>{meta.label}</span>
                  </button>
                );
              })}
            </div>
          ) : def.field === "size" ? (
            <div className="grid grid-cols-3 gap-3">
              {(options as Size[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("size", s)}
                  className={`flex h-16 items-center justify-center rounded-md border text-center transition-all duration-150 ease-out active:scale-[0.98] ${
                    answers.size === s ? "border-ink bg-primary-tint shadow-soft" : "border-hairline bg-surface-soft"
                  }`}
                >
                  <span className="font-display text-[20px] font-medium text-ink">{s}</span>
                </button>
              ))}
            </div>
          ) : hasIllustration ? (
            <div className={`grid gap-3 ${def.field === "neckline" || def.field === "sleeve" ? "grid-cols-3" : "grid-cols-2"}`}>
              {options.map((opt) => {
                const active = answers[def.field] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set(def.field as Exclude<Field, "color" | "size">, opt as never)}
                    className={`flex flex-col items-center gap-2 rounded-md border p-3 text-center transition-all duration-150 ease-out active:scale-[0.98] ${
                      active ? "border-ink bg-primary-tint shadow-soft" : "border-hairline bg-surface-soft"
                    }`}
                  >
                    <IconFor field={def.field} value={opt} />
                    <span className="text-[13px] font-medium text-ink">{opt}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {options.map((opt) => {
                const active = answers[def.field] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set(def.field as Exclude<Field, "color" | "size">, opt as never)}
                    className={`pill ${active ? "pill-accent-active" : ""}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <BuilderPreview answers={answers} />
      </section>

      <FooterCTA
        primaryLabel={step === total - 1 ? "Reveal my dress ✦" : "Continue"}
        onPrimary={next}
        primaryDisabled={!ready}
      />
    </main>
  );
}

function isComplete(a: Partial<BuilderAnswers>): a is BuilderAnswers {
  return !!a.neckline && !!a.length && !!a.fabric && !!a.sleeve && !!a.slit && !!a.color && !!a.size;
}

function BuilderPreview({ answers }: { answers: Partial<BuilderAnswers> }) {
  const items: { label: string; value?: string }[] = [
    { label: "Neckline", value: answers.neckline },
    { label: "Length",   value: answers.length },
    { label: "Fabric",   value: answers.fabric },
    { label: "Sleeves",  value: answers.sleeve },
    { label: "Slit",     value: answers.slit },
    { label: "Colour",   value: answers.color ? COLORS[answers.color].label : undefined },
    { label: "Size",     value: answers.size },
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
