"use client";

import { UserRound } from "lucide-react-v1";

import { ACCENT, type Accent } from "@/mentorship/components/accents";
import { MENTORS, getStudentsInGroup, groupLabel } from "@/mentorship/data/program";
import { cn } from "@/mentorship/lib/utils";

/** The five-tile "which mentor are you?" chooser used across the mentor forms. */
export function MentorPicker({
  accent = "brand",
  selectedId,
  onSelect,
  legend = "Which mentor are you?",
}: {
  accent?: Accent;
  selectedId: string;
  onSelect: (mentorId: string) => void;
  legend?: string;
}) {
  const styles = ACCENT[accent];

  return (
    <fieldset>
      <legend className="flex items-center gap-2 text-sm font-semibold text-ink-900">
        <UserRound className={cn("size-4", styles.text)} aria-hidden />
        {legend}
      </legend>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {MENTORS.map((mentor) => {
          const isActive = mentor.id === selectedId;
          const groupSize = getStudentsInGroup(mentor.groupId).length;

          return (
            <button
              key={mentor.id}
              type="button"
              onClick={() => onSelect(mentor.id)}
              aria-pressed={isActive}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3.5 text-left transition",
                isActive ? styles.selected : "border-ink-200 bg-white hover:bg-ink-50",
              )}
            >
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold transition",
                  isActive ? cn(styles.fill, "text-white") : "bg-ink-100 text-ink-500",
                )}
              >
                {mentor.name
                  .split(" ")
                  .map((part) => part.charAt(0))
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink-900">
                  {mentor.name}
                </span>
                <span className="block text-xs text-ink-500">
                  {groupLabel(mentor.groupId)} &middot; {groupSize} mentee
                  {groupSize === 1 ? "" : "s"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
