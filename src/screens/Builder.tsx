import { useState, useRef } from "react";
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
import { DressViz } from "../lib/dress-viz";
import { NecklineIcon, LengthIcon, FabricIcon, SleeveIcon, SlitIcon } from "../lib/icons";
import { FooterCTA, Header } from "./_chrome";

interface BuilderProps {
  onBack: () => void;
  onComplete: (answers: BuilderAnswers) => void;
}

type Field = keyof BuilderAnswers;

const CATEGORIES: { field: Field; label: string; icon: string }[] = [
  { field: "neckline", label: "Neckline", icon: "◡" },
  { field: "length",   label: "Length",   icon: "↕" },
  { field: "fabric",   label: "Fabric",   icon: "≋" },
  { field: "sleeve",   label: "Sleeves",  icon: "⌒" },
  { field: "slit",     label: "Slit",     icon: "╱" },
  { field: "color",    label: "Colour",   icon: "◉" },
  { field: "size",     label: "Size",     icon: "◻" },
];

function optionsFor(field: Field): string[] {
  switch (field) {
    case "neckline": return NECKLINES;
    case "length":   return LENGTHS;
    case "fabric":   return FABRICS;
    case "sleeve":   return SLEEVES;
    case "slit":     return SLITS;
    case "color":    return Object.keys(COLORS) as Color[];
    case "size":     return SIZES;
  }
}

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
  const [answers, setAnswers] = useState<Partial<BuilderAnswers>>({});
  const [openCategory, setOpenCategory] = useState<Field>("neckline");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filledCount = CATEGORIES.filter((c) => answers[c.field] !== undefined).length;

  const set = <K extends Field>(field: K, v: BuilderAnswers[K]) => {
    setAnswers((a) => ({ ...a, [field]: v }));
    // Auto-advance to next unfilled category after a short delay
    setTimeout(() => {
      const idx = CATEGORIES.findIndex((c) => c.field === field);
      const nextUnfilled = CATEGORIES.find((c, i) => i > idx && answers[c.field] === undefined && c.field !== field);
      if (nextUnfilled) {
        setOpenCategory(nextUnfilled.field);
        sectionRefs.current[nextUnfilled.field]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 250);
  };

  const toggle = (field: Field) => {
    setOpenCategory((prev) => (prev === field ? "" as Field : field));
  };

  const complete = isComplete(answers);

  // Default dress params for preview
  const previewParams = {
    neckline: (answers.neckline ?? "v-neck") as Neckline,
    length: (answers.length ?? "midi") as Length,
    fabric: (answers.fabric ?? "silk") as Fabric,
    sleeve: (answers.sleeve ?? "sleeveless") as Sleeve,
    slit: (answers.slit ?? "none") as Slit,
    color: (answers.color ?? "blush") as Color,
  };

  return (
    <main className="flex flex-1 flex-col px-5 pb-6">
      <Header onBack={onBack} title="Build my dress" />

      {/* Live dress preview — sticky hero */}
      <div className="sticky top-[72px] z-[5] -mx-5 bg-gradient-to-b from-primary-tint via-white to-transparent px-5 pb-4">
        <div className="flex items-center justify-center py-3">
          <div className="relative">
            <DressViz params={previewParams} width={130} height={220} />
            {/* progress ring */}
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">
              {filledCount}/{CATEGORIES.length}
            </div>
          </div>
        </div>
      </div>

      {/* Accordion categories */}
      <div className="mt-2 space-y-2 pb-4">
        {CATEGORIES.map((cat) => {
          const isOpen = openCategory === cat.field;
          const value = answers[cat.field];
          const hasValue = value !== undefined;
          const displayValue = cat.field === "color" && value ? COLORS[value as Color].label : value;

          return (
            <div
              key={cat.field}
              ref={(el) => { sectionRefs.current[cat.field] = el; }}
              className={`rounded-lg border transition-all duration-200 ${
                isOpen
                  ? "border-ink bg-white shadow-soft"
                  : hasValue
                    ? "border-hairline bg-surface-soft"
                    : "border-hairline-soft bg-surface-soft/50"
              }`}
            >
              {/* Category header */}
              <button
                type="button"
                onClick={() => toggle(cat.field)}
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[16px]">{cat.icon}</span>
                  <span className={`text-[15px] font-medium ${hasValue ? "text-ink" : "text-muted"}`}>
                    {cat.label}
                  </span>
                  {hasValue && !isOpen && (
                    <span className="rounded-full bg-primary-tint px-2.5 py-0.5 text-[12px] font-medium text-primary">
                      {displayValue}
                    </span>
                  )}
                </div>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-4 pb-4 pt-1">
                  <CategoryOptions
                    field={cat.field}
                    selected={value}
                    onSelect={(v) => set(cat.field, v as BuilderAnswers[typeof cat.field])}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <FooterCTA
        primaryLabel="Reveal my dress ✦"
        onPrimary={() => complete && onComplete(answers as BuilderAnswers)}
        primaryDisabled={!complete}
        hint={!complete ? <span className="text-muted">Choose all {CATEGORIES.length} options to reveal</span> : undefined}
      />
    </main>
  );
}

function CategoryOptions({
  field,
  selected,
  onSelect,
}: {
  field: Field;
  selected: string | undefined;
  onSelect: (v: string) => void;
}) {
  const options = optionsFor(field);
  const hasIllustration = ["neckline", "length", "fabric", "sleeve", "slit"].includes(field);

  if (field === "color") {
    return (
      <div className="grid grid-cols-4 gap-3">
        {(options as Color[]).map((c) => {
          const meta = COLORS[c];
          const active = selected === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onSelect(c)}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className={`h-10 w-10 rounded-full ring-2 ring-offset-2 transition-all ${
                  active ? "ring-ink scale-110" : "ring-transparent"
                }`}
                style={{ background: meta.hex }}
              />
              <span className={`text-[11px] ${active ? "text-ink font-semibold" : "text-muted"}`}>
                {meta.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (field === "size") {
    return (
      <div className="flex flex-wrap gap-2">
        {(options as Size[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSelect(s)}
            className={`flex h-11 w-14 items-center justify-center rounded-md border text-center transition-all duration-150 active:scale-95 ${
              selected === s
                ? "border-ink bg-ink text-white shadow-soft"
                : "border-hairline bg-surface-soft text-ink"
            }`}
          >
            <span className="font-display text-[15px] font-semibold">{s}</span>
          </button>
        ))}
      </div>
    );
  }

  if (hasIllustration) {
    const cols = field === "neckline" ? "grid-cols-4" : field === "sleeve" ? "grid-cols-3" : "grid-cols-3";
    return (
      <div className={`grid ${cols} gap-2`}>
        {options.map((opt) => {
          const active = selected === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-all duration-150 active:scale-95 ${
                active
                  ? "border-ink bg-primary-tint shadow-soft"
                  : "border-hairline bg-white hover:border-hairline-soft"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center [&_svg]:h-10 [&_svg]:w-10">
                <IconFor field={field} value={opt} />
              </div>
              <span className={`text-[11px] leading-tight ${active ? "font-semibold text-ink" : "text-muted"}`}>
                {opt}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Fallback — pills
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-150 active:scale-95 ${
              active
                ? "border-ink bg-ink text-white"
                : "border-hairline bg-surface-soft text-ink"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function isComplete(a: Partial<BuilderAnswers>): a is BuilderAnswers {
  return !!a.neckline && !!a.length && !!a.fabric && !!a.sleeve && !!a.slit && !!a.color && !!a.size;
}
