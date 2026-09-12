"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react-v1";

import { STUDENTS, fullName, type Student } from "@/mentorship/data/program";
import { cn, initials, searchable } from "@/mentorship/lib/utils";

/** Single-select, searchable list a mentee uses to find themselves. */
export function StudentCombobox({
  selected,
  onSelect,
}: {
  selected: Student | null;
  onSelect: (student: Student | null) => void;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = searchable(query.trim());
    if (!q) return STUDENTS;
    return STUDENTS.filter((student) =>
      searchable(`${fullName(student)} ${student.email}`).includes(q),
    );
  }, [query]);

  if (selected) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-600 text-sm font-bold text-white">
          {initials(selected.firstName, selected.lastName)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-bold text-ink-900">
            {fullName(selected)}
          </span>
          <span className="block truncate text-xs text-ink-500">
            {selected.email || "No email on file"}
          </span>
        </span>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            onSelect(null);
          }}
          className="shrink-0 rounded-lg border border-teal-300 bg-white px-3 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-50"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Type your name to find yourself…"
          aria-label="Search for your name"
          autoComplete="off"
          className="w-full rounded-xl border border-ink-200 bg-white py-3 pl-11 pr-4 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
        />
      </div>

      <ul
        className="scroll-slim mt-3 max-h-80 space-y-1.5 overflow-y-auto rounded-xl border border-ink-100 bg-ink-50/40 p-2"
        role="listbox"
        aria-label="Participants"
      >
        {results.length === 0 && (
          <li className="px-3 py-8 text-center text-sm text-ink-500">
            No participant matches “{query}”.
          </li>
        )}

        {results.map((student) => (
          <li key={student.id}>
            <button
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => onSelect(student)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border border-transparent bg-white/70 px-3 py-2.5 text-left transition",
                "hover:border-teal-200 hover:bg-white",
              )}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink-100 text-xs font-bold text-ink-500">
                {initials(student.firstName, student.lastName)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink-900">
                  {fullName(student)}
                </span>
                <span className="block truncate text-xs text-ink-500">
                  {student.email || "No email on file"}
                </span>
              </span>
              <Check className="size-4 shrink-0 text-teal-500 opacity-0 transition group-hover:opacity-100" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
