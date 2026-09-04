"use client";

import { useMemo, useState } from "react";
import { Check, Search, Users, X } from "lucide-react-v1";

import { STUDENTS, fullName, getStudentsInGroup, groupLabel, type GroupId } from "@/mentorship/data/program";
import { cn, initials, searchable } from "@/mentorship/lib/utils";

export function MenteeMultiSelect({
  selectedIds,
  onChange,
  mentorGroupId,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  mentorGroupId?: GroupId;
}) {
  const [query, setQuery] = useState("");

  /**
   * A mentor only ever reports on their own group, so that is the whole list
   * they see. Showing the full roster made them scroll past everyone else's
   * mentees to find their four or five.
   */
  const pool = useMemo(
    () => (mentorGroupId === undefined ? STUDENTS : getStudentsInGroup(mentorGroupId)),
    [mentorGroupId],
  );

  const results = useMemo(() => {
    const q = searchable(query.trim());
    if (!q) return pool;
    return pool.filter((student) =>
      searchable(`${fullName(student)} ${student.email}`).includes(q),
    );
  }, [pool, query]);

  const selectedStudents = useMemo(
    () => selectedIds.map((id) => pool.find((s) => s.id === id)).filter((s) => s !== undefined),
    [pool, selectedIds],
  );

  const groupMembers = mentorGroupId === undefined ? [] : pool;
  const groupFullySelected =
    groupMembers.length > 0 && groupMembers.every((s) => selectedIds.includes(s.id));

  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  }

  return (
    <div>
      {/* -------- Search -------- */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            mentorGroupId === undefined
              ? "Search mentees by name or email…"
              : `Search your ${groupLabel(mentorGroupId).toLowerCase()} mentees…`
          }
          aria-label="Search mentees"
          className="w-full rounded-xl border border-ink-200 bg-white py-3 pl-11 pr-4 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        />
      </div>

      {/* -------- Quick actions -------- */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {groupMembers.length > 0 && (
          <button
            type="button"
            onClick={() =>
              onChange(
                groupFullySelected
                  ? selectedIds.filter((id) => !groupMembers.some((s) => s.id === id))
                  : Array.from(new Set([...selectedIds, ...groupMembers.map((s) => s.id)])),
              )
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
          >
            <Users className="size-3.5" aria-hidden />
            {groupFullySelected ? "Clear" : "Select all in"} {groupLabel(mentorGroupId ?? null)}
          </button>
        )}
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-500 transition hover:bg-ink-50 hover:text-ink-700"
          >
            Clear selection
          </button>
        )}
        <span className="ml-auto text-xs font-medium text-ink-500">
          {selectedIds.length} of {pool.length} selected
        </span>
      </div>

      {/* -------- Selected chips -------- */}
      {selectedStudents.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 rounded-xl border border-brand-100 bg-brand-50/60 p-3">
          {selectedStudents.map((student) => (
            <span
              key={student.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-white py-1 pl-1 pr-2 text-xs font-semibold text-ink-800 shadow-sm ring-1 ring-brand-100"
            >
              <span className="grid size-5 place-items-center rounded-full bg-brand-500 text-[9px] font-bold text-white">
                {initials(student.firstName, student.lastName)}
              </span>
              {fullName(student)}
              <button
                type="button"
                onClick={() => toggle(student.id)}
                aria-label={`Remove ${fullName(student)}`}
                className="ml-0.5 rounded-full p-0.5 text-ink-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <X className="size-3" aria-hidden />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* -------- Results -------- */}
      <ul
        className="scroll-slim mt-4 max-h-[22rem] space-y-1.5 overflow-y-auto rounded-xl border border-ink-100 bg-ink-50/40 p-2"
        role="listbox"
        aria-multiselectable
        aria-label="Mentees"
      >
        {results.length === 0 && (
          <li className="px-3 py-8 text-center text-sm text-ink-500">
            {pool.length === 0
              ? "No mentees have been assigned to your group yet."
              : `No mentee matches “${query}”.`}
          </li>
        )}

        {results.map((student) => {
          const isSelected = selectedIds.includes(student.id);
          return (
            <li key={student.id}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => toggle(student.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition",
                  isSelected
                    ? "border-brand-300 bg-white shadow-sm"
                    : "border-transparent bg-white/70 hover:border-ink-200 hover:bg-white",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold transition",
                    isSelected ? "bg-brand-500 text-white" : "bg-ink-100 text-ink-500",
                  )}
                >
                  {isSelected ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    initials(student.firstName, student.lastName)
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink-900">
                    {fullName(student)}
                  </span>
                  <span className="block truncate text-xs text-ink-500">
                    {student.email || "No email on file"}
                  </span>
                </span>

                {mentorGroupId === undefined && student.groupId !== null && (
                  <span className="hidden shrink-0 rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-500 sm:block">
                    {groupLabel(student.groupId)}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
