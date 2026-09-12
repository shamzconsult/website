"use client";

import { Check } from "lucide-react-v1";

import { cn } from "@/mentorship/lib/utils";

export interface StepDefinition {
  title: string;
  hint: string;
}

export function Stepper({
  steps,
  current,
  onSelect,
}: {
  steps: StepDefinition[];
  current: number;
  /** Only completed steps can be jumped to. */
  onSelect: (index: number) => void;
}) {
  return (
    <>
      {/* ---------- Mobile: slim progress bar ---------- */}
      <div className="lg:hidden">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-bold text-ink-900">{steps[current].title}</p>
          <p className="text-xs font-medium text-ink-500">
            Step {current + 1} of {steps.length}
          </p>
        </div>
        <p className="mt-0.5 text-xs text-ink-500">{steps[current].hint}</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
            style={{ width: `${((current + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ---------- Desktop: vertical rail ---------- */}
      <ol className="hidden lg:block">
        {steps.map((step, index) => {
          const isDone = index < current;
          const isCurrent = index === current;

          return (
            <li key={step.title} className="relative pb-7 last:pb-0">
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-[15px] top-8 h-full w-0.5 -translate-x-1/2 transition-colors duration-300",
                    isDone ? "bg-brand-400" : "bg-ink-200",
                  )}
                />
              )}

              <button
                type="button"
                disabled={!isDone}
                onClick={() => isDone && onSelect(index)}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "relative flex w-full items-start gap-3 text-left transition",
                  isDone && "cursor-pointer hover:opacity-80",
                  !isDone && !isCurrent && "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border-2 text-xs font-bold transition duration-300",
                    isDone && "border-brand-500 bg-brand-500 text-white",
                    isCurrent && "border-brand-500 bg-white text-brand-600 ring-4 ring-brand-100",
                    !isDone && !isCurrent && "border-ink-200 bg-white text-ink-400",
                  )}
                >
                  {isDone ? <Check className="size-4" aria-hidden /> : index + 1}
                </span>

                <span className="min-w-0 pt-0.5">
                  <span
                    className={cn(
                      "block text-sm font-semibold transition-colors",
                      isCurrent ? "text-ink-900" : isDone ? "text-ink-700" : "text-ink-400",
                    )}
                  >
                    {step.title}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block text-xs leading-snug",
                      isCurrent ? "text-ink-500" : "text-ink-400",
                    )}
                  >
                    {step.hint}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </>
  );
}
