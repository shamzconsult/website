"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, PhoneCall, Save } from "lucide-react-v1";

import { FormActions, FormBanner, Panel, SuccessScreen } from "@/mentorship/components/FormShell";
import { MentorPicker } from "@/mentorship/components/MentorPicker";
import { SiteFooter, SiteHeader } from "@/mentorship/components/SiteHeader";
import { StatusMessage } from "@/mentorship/components/StatusMessage";
import { StudentCombobox } from "@/mentorship/components/StudentCombobox";
import { ACCENT } from "@/mentorship/components/accents";
import { CALL_MODES } from "@/mentorship/data/forms";
import {
  HOST_COMPANY,
  fullName,
  getMentorById,
  getMentorForStudent,
  getStudentsInGroup,
  type Student,
} from "@/mentorship/data/program";
import { cn, formatLongDate, initials, todayIso } from "@/mentorship/lib/utils";

type Role = "mentor" | "mentee";
type Status = "idle" | "submitting" | "error" | "success";

const ACCENT_KEY = "ink" as const;

/**
 * "We spoke." Date, mode, one short note — that is the whole form.
 *
 * Mentors fill this after every call, so it deliberately stays lighter than
 * the monthly report: no file uploads, no per-question sections, and it
 * remembers who you are between entries so logging a second call is two taps.
 */
export default function CallLogPage() {
  const [role, setRole] = useState<Role>("mentor");
  const [mentorId, setMentorId] = useState("");
  const [mentee, setMentee] = useState<Student | null>(null);
  /** A mentor can log one call against several mentees at once. */
  const [menteeIds, setMenteeIds] = useState<string[]>([]);
  const [callDate, setCallDate] = useState(todayIso());
  const [mode, setMode] = useState<string>("");
  const [note, setNote] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  /** Set when the entry was saved but its email notification failed. */
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [lastLogged, setLastLogged] = useState<{ mentor: string; mentees: string[] } | null>(null);

  const mentor = getMentorById(mentorId);
  const group = useMemo(() => (mentor ? getStudentsInGroup(mentor.groupId) : []), [mentor]);
  const menteeMentor = mentee ? getMentorForStudent(mentee) : undefined;

  /* ---- What counts as a complete entry ---------------------------------
   * Only the pair and the date are needed. Mode and note are optional, so a
   * call can be logged in two taps and annotated later. */
  const partyChosen =
    role === "mentor" ? Boolean(mentorId) && menteeIds.length > 0 : Boolean(mentee);
  const canSubmit = partyChosen && status !== "submitting";

  function toggleMentee(id: string) {
    setMenteeIds((previous) =>
      previous.includes(id) ? previous.filter((other) => other !== id) : [...previous, id],
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/call-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loggedBy: role,
          personId: role === "mentor" ? mentorId : mentee?.id,
          counterpartIds: role === "mentor" ? menteeIds : undefined,
          callDate,
          mode,
          note: note.trim(),
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setError(result?.message ?? "Something went wrong. Please try again.");
        return;
      }

      setLastLogged({ mentor: result.mentorName, mentees: result.menteeNames ?? [] });
      setNotice(typeof result?.warning === "string" ? result.warning : "");
    setStatus("success");
    } catch {
      setStatus("error");
      setError("We could not reach the server. Check your internet connection and try again.");
    }
  }

  /** Keeps who you are, clears what the call was — the common next action. */
  function logAnother() {
    setMenteeIds([]);
    setMode("");
    setNote("");
    setCallDate(todayIso());
    setStatus("idle");
    setNotice("");
    setError("");
  }

  /* ====================================================================== */
  if (status === "success") {
    return (
      <SuccessScreen
        accent={ACCENT_KEY}
        title="Call logged"
        notice={notice}
        actions={
          <button
            type="button"
            onClick={logAnother}
            className={cn("rounded-xl px-5 py-3 text-sm font-semibold", ACCENT[ACCENT_KEY].solid)}
          >
            Log another call
          </button>
        }
      >
        <p>
          The call between <strong className="text-ink-900">{lastLogged?.mentor}</strong> and{" "}
          <strong className="text-ink-900">{namesOf(lastLogged?.mentees ?? [])}</strong> on{" "}
          {formatLongDate(callDate)} is on record with {HOST_COMPANY.name}.
        </p>
        <p className="mt-3 text-ink-500">
          These entries feed the final evaluation sheets at the end of the programme.
        </p>
      </SuccessScreen>
    );
  }

  /* ====================================================================== */
  return (
    <>
      <SiteHeader showBack />

      <main className="flex-1 bg-ink-50">
        <FormBanner
          accent={ACCENT_KEY}
          eyebrow="Mentor or mentee"
          icon={PhoneCall}
          title="Log a call"
          description="Just the date, how you spoke and a line about it. Either side can log a call, and it takes under a minute."
        />

        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-3xl space-y-5 px-4 pb-20 sm:px-6">
          {/* ---- 1. Who is logging ---- */}
          <Panel
            accent={ACCENT_KEY}
            step={1}
            title="Who is logging this call?"
            subtitle="We use this to match the entry to the right mentorship pair."
          >
            <div className="grid gap-2.5 sm:grid-cols-2">
              {(["mentor", "mentee"] as Role[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={role === option}
                  onClick={() => {
                    setRole(option);
                    setMenteeIds([]);
                    setMentee(null);
                  }}
                  className={cn(
                    "rounded-xl border p-4 text-left transition",
                    role === option
                      ? ACCENT[ACCENT_KEY].selected
                      : "border-ink-200 bg-white hover:bg-ink-50",
                  )}
                >
                  <span className="block text-sm font-bold capitalize text-ink-900">
                    I am the {option}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-500">
                    {option === "mentor"
                      ? "Pick yourself, then the mentees you spoke with."
                      : "Find your name — we know who your mentor is."}
                  </span>
                </button>
              ))}
            </div>
          </Panel>

          {/* ---- 2. The pair ---- */}
          <Panel
            accent={ACCENT_KEY}
            step={2}
            title={role === "mentor" ? "You and your mentee" : "Find yourself"}
            subtitle={
              role === "mentor"
                ? "Select your name, then everyone who was on the call."
                : "Your mentor is filled in automatically from the roster."
            }
          >
            {role === "mentor" ? (
              <>
                <MentorPicker
                  accent={ACCENT_KEY}
                  selectedId={mentorId}
                  onSelect={(nextId) => {
                    setMentorId(nextId);
                    setMenteeIds([]);
                  }}
                />

                {mentor && (
                  <div className="mt-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-ink-900">
                        Who did you speak with?{" "}
                        <span className="font-normal text-ink-500">
                          Select everyone who was on the call.
                        </span>
                      </p>
                      {group.length > 0 && (
                        <span className="text-xs font-medium text-ink-500">
                          {menteeIds.length} of {group.length} selected
                        </span>
                      )}
                    </div>

                    {group.length === 0 ? (
                      <div className="mt-3">
                        <StatusMessage tone="warning">
                          No mentees have been assigned to your group yet. Please contact{" "}
                          {HOST_COMPANY.name}.
                        </StatusMessage>
                      </div>
                    ) : (
                      <>
                        {group.length > 1 && (
                          <div className="mt-3">
                            <button
                              type="button"
                              onClick={() =>
                                setMenteeIds(
                                  menteeIds.length === group.length
                                    ? []
                                    : group.map((student) => student.id),
                                )
                              }
                              className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 transition hover:bg-ink-50 hover:text-ink-800"
                            >
                              {menteeIds.length === group.length
                                ? "Clear selection"
                                : "Select everyone"}
                            </button>
                          </div>
                        )}

                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {group.map((student) => {
                            const isSelected = menteeIds.includes(student.id);
                            return (
                              <button
                                key={student.id}
                                type="button"
                                role="checkbox"
                                aria-checked={isSelected}
                                onClick={() => toggleMentee(student.id)}
                                className={cn(
                                  "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                                  isSelected
                                    ? ACCENT[ACCENT_KEY].selected
                                    : "border-ink-200 bg-white hover:bg-ink-50",
                                )}
                              >
                                <span
                                  className={cn(
                                    "grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                                    isSelected
                                      ? cn(ACCENT[ACCENT_KEY].fill, "text-white")
                                      : "bg-ink-100 text-ink-500",
                                  )}
                                >
                                  {isSelected ? (
                                    <Check className="size-4" aria-hidden />
                                  ) : (
                                    initials(student.firstName, student.lastName)
                                  )}
                                </span>
                                <span className="min-w-0 truncate text-sm font-semibold text-ink-900">
                                  {fullName(student)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <StudentCombobox selected={mentee} onSelect={setMentee} />

                {mentee && (
                  <div className="mt-4">
                    {menteeMentor ? (
                      <p className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm text-ink-700">
                        Logging a call with{" "}
                        <strong className="text-ink-900">{menteeMentor.name}</strong>, your mentor.
                      </p>
                    ) : (
                      <StatusMessage tone="warning" title="No mentor assigned yet">
                        You have not been placed in a mentorship group, so there is no pair to log
                        against. Please contact {HOST_COMPANY.name}.
                      </StatusMessage>
                    )}
                  </div>
                )}
              </>
            )}
          </Panel>

          {/* ---- 3. The call ---- */}
          <Panel
            accent={ACCENT_KEY}
            step={3}
            title="The call"
            subtitle="Date, how you spoke, and a short note."
            disabled={!partyChosen}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="callDate"
                  className="flex items-center gap-2 text-sm font-semibold text-ink-900"
                >
                  <CalendarDays className="size-4 text-ink-500" aria-hidden />
                  Date of the call
                </label>
                <input
                  id="callDate"
                  type="date"
                  value={callDate}
                  max={todayIso()}
                  disabled={!partyChosen}
                  onChange={(event) => setCallDate(event.target.value)}
                  className={cn(
                    "mt-2.5 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 shadow-sm outline-none transition disabled:bg-ink-50",
                    ACCENT[ACCENT_KEY].ring,
                  )}
                />
                {callDate && <p className="mt-2 text-xs text-ink-500">{formatLongDate(callDate)}</p>}
              </div>

              <div>
                <p className="text-sm font-semibold text-ink-900">
                  Mode <span className="font-normal text-ink-400">(optional)</span>
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {CALL_MODES.map((option) => (
                    <button
                      key={option}
                      type="button"
                      disabled={!partyChosen}
                      aria-pressed={mode === option}
                      onClick={() => setMode(option)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:opacity-50",
                        mode === option
                          ? cn(ACCENT[ACCENT_KEY].selected, "text-ink-900")
                          : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="note" className="text-sm font-semibold text-ink-900">
                Short note <span className="font-normal text-ink-400">(optional)</span>
              </label>
              <textarea
                id="note"
                rows={4}
                value={note}
                disabled={!partyChosen}
                onChange={(event) => setNote(event.target.value)}
                placeholder="What did you cover? One or two lines is plenty."
                className={cn(
                  "mt-2.5 w-full resize-y rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm leading-relaxed text-ink-900 outline-none transition placeholder:text-ink-400 disabled:bg-ink-50",
                  ACCENT[ACCENT_KEY].ring,
                )}
              />
            </div>
          </Panel>

          {status === "error" && (
            <StatusMessage tone="error" title="Your entry was not saved">
              {error}
            </StatusMessage>
          )}

          <FormActions
            accent={ACCENT_KEY}
            icon={Save}
            submitLabel="Log this call"
            submittingLabel="Saving…"
            canSubmit={canSubmit}
            submitting={status === "submitting"}
          />
        </form>
      </main>

      <SiteFooter />
    </>
  );
}

/** ["A", "B", "C"] -> "A, B and C" - for the confirmation line. */
const namesOf = (names: string[]) =>
  names.length < 2
    ? (names[0] ?? "your mentee")
    : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
