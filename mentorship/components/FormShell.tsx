"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CircleCheckBig, LoaderCircle, type LucideIcon } from "lucide-react-v1";

import { SiteFooter, SiteHeader } from "@/mentorship/components/SiteHeader";
import { StatusMessage } from "@/mentorship/components/StatusMessage";
import { ACCENT, type Accent } from "@/mentorship/components/accents";
import { cn } from "@/mentorship/lib/utils";

/* ==========================================================================
 * The dark banner every form page opens with.
 * ========================================================================== */
export function FormBanner({
  accent,
  eyebrow,
  icon: Icon,
  title,
  description,
  wide = false,
}: {
  accent: Accent;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  description: string;
  wide?: boolean;
}) {
  const styles = ACCENT[accent];

  return (
    <div className="relative overflow-hidden bg-ink-950 pb-16 pt-10 sm:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="grid-texture absolute inset-0 opacity-60" />
        <div
          className={cn("absolute -right-20 -top-24 size-80 rounded-full blur-[90px]", styles.glow)}
        />
      </div>

      <div className={cn("relative mx-auto px-4 sm:px-6", wide ? "max-w-6xl" : "max-w-3xl")}>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]",
            styles.badge,
          )}
        >
          <Icon className="size-3.5" aria-hidden />
          {eyebrow}
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-ink-300 sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ==========================================================================
 * A numbered white card.
 * ========================================================================== */
export function Panel({
  accent,
  step,
  title,
  subtitle,
  disabled = false,
  children,
}: {
  accent: Accent;
  step?: number;
  title: string;
  subtitle?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-ink-100 bg-white p-5 shadow-sm transition sm:p-7",
        disabled && "opacity-60",
      )}
    >
      <div className="mb-5 flex items-start gap-3.5">
        {step !== undefined && (
          <span
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold",
              ACCENT[accent].step,
            )}
          >
            {step}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-ink-900">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-sm leading-relaxed text-ink-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

/* ==========================================================================
 * The "thank you, that's submitted" screen.
 * ========================================================================== */
export function SuccessScreen({
  accent,
  title,
  children,
  actions,
  notice,
}: {
  accent: Accent;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  /**
   * Shown when the submission was kept but something secondary did not work -
   * in practice, when the entry is safely recorded but the email notification
   * could not be sent. The submitter should know, without being told their
   * work was lost.
   */
  notice?: string;
}) {
  const styles = ACCENT[accent];

  return (
    <>
      <SiteHeader showBack />
      <main className="flex flex-1 items-center justify-center bg-ink-50 px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg rounded-3xl border border-ink-100 bg-white p-8 text-center shadow-xl sm:p-10"
        >
          <span
            className={cn("mx-auto grid size-16 place-items-center rounded-full", styles.tint)}
          >
            <CircleCheckBig className={cn("size-8", styles.text)} aria-hidden />
          </span>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-bold text-ink-900">
            {title}
          </h1>
          <div className="mt-3 text-sm leading-relaxed text-ink-600">{children}</div>

          {notice && (
            <div className="mt-5 text-left">
              <StatusMessage tone="warning" title="Saved, but not emailed">
                {notice}
              </StatusMessage>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {actions}
            <Link
              href="/"
              className="rounded-xl border border-ink-200 px-5 py-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
            >
              Back to home
            </Link>
          </div>
        </motion.div>
      </main>
      <SiteFooter />
    </>
  );
}

/* ==========================================================================
 * Cancel / submit footer shared by the single-page forms.
 * ========================================================================== */
export function FormActions({
  accent,
  submitLabel,
  submittingLabel,
  canSubmit,
  submitting,
  icon: Icon,
}: {
  accent: Accent;
  submitLabel: string;
  submittingLabel: string;
  canSubmit: boolean;
  submitting: boolean;
  icon: LucideIcon;
}) {
  const Glyph = submitting ? LoaderCircle : Icon;

  return (
    <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Cancel
      </Link>

      <button
        type="submit"
        disabled={!canSubmit || submitting}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition",
          canSubmit && !submitting ? ACCENT[accent].solid : "cursor-not-allowed bg-ink-300",
        )}
      >
        <Glyph className={cn("size-4", submitting && "animate-spin")} aria-hidden />
        {submitting ? submittingLabel : submitLabel}
      </button>
    </div>
  );
}
