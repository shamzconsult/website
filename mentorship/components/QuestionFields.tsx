"use client";

import { ACCENT, type Accent } from "@/mentorship/components/accents";
import type { OpenQuestion } from "@/mentorship/data/forms";
import { cn } from "@/mentorship/lib/utils";

/**
 * Renders a list of open questions as labelled textareas. Used by both intake
 * forms and by the monthly per-mentee evaluation.
 */
export function QuestionFields({
  accent,
  questions,
  values,
  onChange,
  idPrefix,
  showErrors = false,
  disabled = false,
}: {
  accent: Accent;
  questions: OpenQuestion[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  /** Keeps input ids unique when several sets appear on one page. */
  idPrefix: string;
  showErrors?: boolean;
  disabled?: boolean;
}) {
  const styles = ACCENT[accent];

  return (
    <div className="space-y-5">
      {questions.map((question, index) => {
        const value = values[question.id] ?? "";
        const missing = showErrors && value.trim().length < 3;
        const fieldId = `${idPrefix}-${question.id}`;

        return (
          <div key={question.id}>
            <label
              htmlFor={fieldId}
              className="flex items-start gap-2.5 text-sm font-semibold text-ink-900"
            >
              <span
                className={cn(
                  "mt-px grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold",
                  styles.step,
                )}
              >
                {index + 1}
              </span>
              <span>{question.label}</span>
            </label>

            <textarea
              id={fieldId}
              rows={question.rows ?? 3}
              value={value}
              disabled={disabled}
              onChange={(event) => onChange(question.id, event.target.value)}
              placeholder={question.placeholder}
              className={cn(
                "mt-2.5 w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm leading-relaxed text-ink-900 outline-none transition placeholder:text-ink-400 disabled:cursor-not-allowed disabled:bg-ink-50",
                missing ? "border-red-300 focus:ring-4 focus:ring-red-100" : cn("border-ink-200", styles.ring),
              )}
            />

            {missing && (
              <p className="mt-1.5 text-xs font-medium text-red-600">This one still needs an answer.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** How many of the questions have a usable answer. */
export const answeredCount = (questions: OpenQuestion[], values: Record<string, string>) =>
  questions.filter((question) => (values[question.id] ?? "").trim().length >= 3).length;

export const allAnswered = (questions: OpenQuestion[], values: Record<string, string>) =>
  answeredCount(questions, values) === questions.length;
