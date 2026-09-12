"use client";

import { ACCENT, type Accent } from "@/mentorship/components/accents";
import { LIKERT_OPTIONS, type LikertStatement, type LikertValue } from "@/mentorship/data/forms";
import { cn } from "@/mentorship/lib/utils";

/**
 * The section 6.0 evaluation sheet, as a form.
 *
 * On a wide screen it reads as the original grid — statements down the left,
 * the five columns across the top. On a phone the columns collapse to a row
 * of five buttons underneath each statement, which is the only way a
 * five-column table stays usable at 360px.
 */
export function LikertGrid({
  accent,
  statements,
  values,
  onChange,
  idPrefix,
  showErrors = false,
}: {
  accent: Accent;
  statements: LikertStatement[];
  values: Record<string, LikertValue | undefined>;
  onChange: (id: string, value: LikertValue) => void;
  idPrefix: string;
  showErrors?: boolean;
}) {
  const styles = ACCENT[accent];

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200">
      {/* ---------- Column headings (desktop only) ---------- */}
      <div className="hidden bg-ink-50 sm:grid sm:grid-cols-[1fr_repeat(5,72px)] sm:gap-px">
        <div className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">
          Statement
        </div>
        {LIKERT_OPTIONS.map((option) => (
          <div
            key={option.value}
            className="px-2 py-3 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-ink-500"
          >
            {option.label}
            <span className="mt-0.5 block text-ink-400">({option.value})</span>
          </div>
        ))}
      </div>

      {/* ---------- Rows ---------- */}
      <ul className="divide-y divide-ink-100">
        {statements.map((statement, index) => {
          const value = values[statement.id];
          const missing = showErrors && !value;

          return (
            <li
              key={statement.id}
              className={cn(
                "px-4 py-4 transition sm:grid sm:grid-cols-[1fr_repeat(5,72px)] sm:items-center sm:gap-px sm:px-0 sm:py-0",
                missing && "bg-red-50/60",
              )}
            >
              <div className="flex items-start gap-2.5 sm:px-4 sm:py-3.5">
                <span className="mt-px w-5 shrink-0 text-xs font-bold text-ink-400">
                  {index + 1}.
                </span>
                <span className="text-sm leading-relaxed text-ink-800">{statement.label}</span>
              </div>

              {/* Desktop: one radio per column */}
              <fieldset className="contents">
                <legend className="sr-only">{statement.label}</legend>

                {LIKERT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="hidden cursor-pointer items-center justify-center self-stretch transition hover:bg-ink-50/70 sm:flex"
                  >
                    <input
                      type="radio"
                      name={`${idPrefix}-${statement.id}`}
                      value={option.value}
                      checked={value === option.value}
                      onChange={() => onChange(statement.id, option.value as LikertValue)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        "grid size-7 place-items-center rounded-full border-2 text-[11px] font-bold transition",
                        value === option.value
                          ? cn(styles.border, styles.fill, "text-white")
                          : "border-ink-200 bg-white text-ink-400",
                      )}
                      aria-hidden
                    >
                      {option.value}
                    </span>
                  </label>
                ))}
              </fieldset>

              {/* Mobile: a row of five labelled buttons */}
              <div className="mt-3 grid grid-cols-5 gap-1.5 sm:hidden">
                {LIKERT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={value === option.value}
                    aria-label={`${option.value} — ${option.label}`}
                    onClick={() => onChange(statement.id, option.value as LikertValue)}
                    className={cn(
                      "rounded-lg border px-1 py-2 text-center transition",
                      value === option.value
                        ? styles.selected
                        : "border-ink-200 bg-white hover:bg-ink-50",
                    )}
                  >
                    <span
                      className={cn(
                        "block text-sm font-bold",
                        value === option.value ? styles.text : "text-ink-700",
                      )}
                    >
                      {option.value}
                    </span>
                    <span className="mt-0.5 block text-[9px] font-semibold uppercase leading-tight tracking-tight text-ink-400">
                      {option.label.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const ratedCount = (
  statements: LikertStatement[],
  values: Record<string, LikertValue | undefined>,
) => statements.filter((statement) => Boolean(values[statement.id])).length;

export const allRated = (
  statements: LikertStatement[],
  values: Record<string, LikertValue | undefined>,
) => ratedCount(statements, values) === statements.length;
