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
import { DressViz } from "../lib/dress-viz";
import { NecklineIcon, LengthIcon, FabricIcon, SleeveIcon, SlitIcon } from "../lib/icons";
import { FooterCTA, Header } from "./_chrome";
import { logEvent } from "../lib/log";

interface BuilderProps {
  onBack: () => void;
  onComplete: (answers: BuilderAnswers) => void;
}

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function Builder({ onBack, onComplete }: BuilderProps) {
  const [step, setStep] = useState<Step>(0);
  const [neckline, setNeckline] = useState<Neckline | null>(null);
  const [length, setLength] = useState<Length | null>(null);
  const [fabric, setFabric] = useState<Fabric | null>(null);
  const [sleeve, setSleeve] = useState<Sleeve | null>(null);
  const [slit, setSlit] = useState<Slit | null>(null);
  const [color, setColor] = useState<Color | null>(null);
  const [size, setSize] = useState<Size | null>(null);

  const total = 7;
  const current = step + 1;

  const ready = useMemo(() => {
    switch (step) {
      case 0: return neckline !== null;
      case 1: return length !== null;
      case 2: return fabric !== null;
      case 3: return sleeve !== null;
      case 4: return slit !== null;
      case 5: return color !== null;
      case 6: return size !== null;
    }
  }, [step, neckline, length, fabric, sleeve, slit, color, size]);

  const next = () => {
    const fields = ["neckline", "length", "fabric", "sleeve", "slit", "color", "size"] as const;
    const values = [neckline, length, fabric, sleeve, slit, color, size];
    const field = fields[step];
    const value = values[step];
    if (value) logEvent("selection", { via: "builder", field, value, step: step + 1 });

    if (step < 6) setStep((s) => (s + 1) as Step);
    else if (neckline && length && fabric && sleeve && slit && color && size)
      onComplete({ neckline, length, fabric, sleeve, slit, color, size });
  };

  const back = () => {
    if (step === 0) onBack();
    else setStep((s) => (s - 1) as Step);
  };

  // Live preview params (uses chosen so far, falls back to safe defaults)
  const previewParams = {
    neckline: (neckline ?? "v-neck") as Neckline,
    length:   (length   ?? "midi")  as Length,
    fabric:   (fabric   ?? "silk")  as Fabric,
    sleeve:   (sleeve   ?? "sleeveless") as Sleeve,
    slit:     (slit     ?? "none")  as Slit,
    color:    (color    ?? "blush") as Color,
  };

  return (
    <main className="flex flex-1 flex-col px-5 pb-6">
      <Header onBack={back} step={{ current, total }} />

      <div className="mt-2 rise rise-1" key={step}>
        {step === 0 && (
          <StepShell eyebrow="Neckline" title="How do you want it to sit at the top?">
            <div className="grid grid-cols-3 gap-2">
              {NECKLINES.map((n) => (
                <OptionCard key={n} active={neckline === n} onClick={() => setNeckline(n)} label={n}>
                  <NecklineIcon neckline={n} />
                </OptionCard>
              ))}
            </div>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell eyebrow="Length" title="Where should it land?">
            <div className="grid grid-cols-3 gap-3">
              {LENGTHS.map((l) => (
                <OptionCard key={l} active={length === l} onClick={() => setLength(l)} label={l}>
                  <LengthIcon length={l} />
                </OptionCard>
              ))}
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell eyebrow="Fabric" title="What should it feel like?">
            <div className="grid grid-cols-3 gap-3">
              {FABRICS.map((f) => (
                <OptionCard key={f} active={fabric === f} onClick={() => setFabric(f)} label={f}>
                  <FabricIcon fabric={f} />
                </OptionCard>
              ))}
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell eyebrow="Sleeves" title="What about the arms?">
            <div className="grid grid-cols-3 gap-3">
              {SLEEVES.map((s) => (
                <OptionCard key={s} active={sleeve === s} onClick={() => setSleeve(s)} label={s}>
                  <SleeveIcon sleeve={s} />
                </OptionCard>
              ))}
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell eyebrow="Slit" title="Should it open up when you walk?">
            <div className="grid grid-cols-2 gap-3">
              {SLITS.map((sl) => (
                <OptionCard key={sl} active={slit === sl} onClick={() => setSlit(sl)} label={sl}>
                  <SlitIcon slit={sl} />
                </OptionCard>
              ))}
            </div>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell eyebrow="Colour" title="And the colour?">
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

        {step === 6 && (
          <StepShell eyebrow="Size" title="What size feels like you?">
            <div className="grid grid-cols-3 gap-3">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`flex h-16 items-center justify-center rounded-md border text-center transition-all duration-150 ease-out active:scale-[0.98] ${
                    size === s ? "border-ink bg-primary-tint shadow-soft" : "border-hairline bg-surface-soft"
                  }`}
                >
                  <span className="font-display text-[20px] font-medium text-ink">{s}</span>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {/* Live preview */}
        <div className="mt-8 flex flex-col items-center rounded-lg border border-hairline-soft bg-gradient-to-b from-primary-tint/40 to-surface-soft p-4">
          <p className="eyebrow mb-3">Your dress so far</p>
          <DressViz params={previewParams} width={120} height={200} />
        </div>
      </div>

      <FooterCTA
        primaryLabel={step === 6 ? "Reveal my dress ✦" : "Continue"}
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

function OptionCard({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all duration-150 ease-out active:scale-[0.98] ${
        active ? "border-ink bg-primary-tint shadow-soft" : "border-hairline bg-surface-soft"
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center [&_svg]:h-12 [&_svg]:w-12">
        {children}
      </div>
      <span className={`text-[12px] capitalize ${active ? "font-semibold text-ink" : "text-muted"}`}>
        {label}
      </span>
    </button>
  );
}
