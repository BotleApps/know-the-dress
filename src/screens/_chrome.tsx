import type { ReactNode } from "react";

interface HeaderProps {
  step?: { current: number; total: number };
  onBack?: () => void;
  title?: string;
}

export function Header({ step, onBack, title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 -mx-5 mb-2 bg-canvas/85 px-5 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack ? (
            <button
              type="button"
              aria-label="Back"
              onClick={onBack}
              className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink active:bg-surface-soft"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Wordmark />
            </div>
          )}
          {title && <span className="text-[15px] font-medium text-ink">{title}</span>}
        </div>
        {step && (
          <span className="body-sm text-muted">
            {step.current} / {step.total}
          </span>
        )}
      </div>
      {step && (
        <div className="progress-track mt-3">
          <div
            className="progress-fill"
            style={{ width: `${(step.current / step.total) * 100}%` }}
          />
        </div>
      )}
    </header>
  );
}

export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-1.5 text-ink">
      <span className="font-display text-[22px] leading-none" style={{ fontWeight: 600 }}>
        Style
      </span>
      <span
        className="font-display text-[22px] leading-none text-primary"
        style={{ fontWeight: 600 }}
      >
        Sift
      </span>
      <span aria-hidden className="ml-0.5 text-primary">✦</span>
    </span>
  );
}

interface FooterCTAProps {
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  hint?: ReactNode;
}

export function FooterCTA({ primaryLabel, onPrimary, primaryDisabled, hint }: FooterCTAProps) {
  return (
    <div
      className="sticky bottom-0 -mx-5 mt-auto bg-canvas/95 px-5 pt-4 backdrop-blur"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
    >
      {hint && <div className="mb-3 text-center body-sm">{hint}</div>}
      <button
        type="button"
        className="btn-primary w-full"
        onClick={onPrimary}
        disabled={primaryDisabled}
      >
        {primaryLabel}
      </button>
    </div>
  );
}

interface ChoiceChipProps {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  variant?: "default" | "accent";
}

export function ChoiceChip({ active, onClick, children, variant = "default" }: ChoiceChipProps) {
  const cls = active
    ? variant === "accent"
      ? "pill pill-accent-active"
      : "pill pill-active"
    : "pill";
  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
