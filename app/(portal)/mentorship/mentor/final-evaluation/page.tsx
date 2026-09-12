"use client";

import { useMemo, useState } from "react";
import { Award, ChevronDown, Send } from "lucide-react-v1";

import { FormActions, FormBanner, Panel, SuccessScreen } from "@/mentorship/components/FormShell";
import { LikertGrid, allRated, ratedCount } from "@/mentorship/components/LikertGrid";
import { MentorPicker } from "@/mentorship/components/MentorPicker";
import { SiteFooter, SiteHeader } from "@/mentorship/components/SiteHeader";
import { StatusMessage } from "@/mentorship/components/StatusMessage";
import { ACCENT } from "@/mentorship/components/accents";
import { MENTOR_FINAL_STATEMENTS, type LikertValue } from "@/mentorship/data/forms";
import { HOST_COMPANY, fullName, getMentorById, getStudentsInGroup } from "@/mentorship/data/program";
import { cn, initials } from "@/mentorship/lib/utils";

type Status = "idle" | "checking" | "locked" | "submitting" | "error" | "success";

interface Sheet {
  ratings: Record<string, LikertValue | undefined>;
  recommendations: string;
}

const emptySheet = (): Sheet => ({ ratings: {}, recommendations: "" });

/**
 * Section 6.0 — Mentor's Final Evaluation Sheet.
 *
 * The paper version is one sheet per mentee, so this is too: an accordion of
 * rating grids, one per mentee in the group, submitted together as a single
 * report to the organiser.
 */
export default function MentorFinalEvaluationPage() {
  const [mentorId, setMentorId] = useState("");
  const [location, setLocation] = useState("");
  const [track, setTrack] = useState("");
  const [sheets, setSheets] = useState<Record<string, Sheet>>({});
  const [openMenteeId, setOpenMenteeId] = useState<string | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  /** Set when the entry was saved but its email notification failed. */
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ menteeCount: number; overallAverage: number | null } | null>(
    null,
  );

  const mentor = getMentorById(mentorId);
  const group = useMemo(() => (mentor ? getStudentsInGroup(mentor.groupId) : []), [mentor]);

  const completedSheets = group.filter((student) =>
    allRated(MENTOR_FINAL_STATEMENTS, sheets[student.id]?.ratings ?? {}),
  );
  // Sheets are optional per mentee and per statement; this only feeds the
  // progress bar and the reminder, never the submit gate.
  const complete = group.length > 0 && completedSheets.length === group.length;

  /** Switching mentor clears any half-filled sheets and re-checks the lock. */
  function choose(nextId: string) {
    setMentorId(nextId);
    setSheets({});
    setOpenMenteeId(null);
    setStatus("checking");

    fetch(`/api/final-evaluation?role=mentor&personId=${encodeURIComponent(nextId)}`)
      .then((response) => response.json())
      .then((payload) => setStatus(payload?.submitted ? "locked" : "idle"))
      .catch(() => setStatus("idle"));
  }

  function rate(menteeId: string, statementId: string, value: LikertValue) {
    setSheets((prev) => {
      const sheet = prev[menteeId] ?? emptySheet();
      return {
        ...prev,
        [menteeId]: { ...sheet, ratings: { ...sheet.ratings, [statementId]: value } },
      };
    });
  }

  function recommend(menteeId: string, text: string) {
    setSheets((prev) => {
      const sheet = prev[menteeId] ?? emptySheet();
      return { ...prev, [menteeId]: { ...sheet, recommendations: text } };
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!mentor) return;

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/final-evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "mentor",
          personId: mentor.id,
          location: location.trim(),
          track: track.trim(),
          sheets: group.map((student) => ({
            menteeId: student.id,
            ratings: sheets[student.id]?.ratings ?? {},
            recommendations: (sheets[student.id]?.recommendations ?? "").trim(),
          })),
        }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus(response.status === 409 ? "locked" : "error");
        setError(payload?.message ?? "Something went wrong. Please try again.");
        return;
      }

      setResult({
        menteeCount: payload.menteeCount ?? group.length,
        overallAverage: typeof payload.overallAverage === "number" ? payload.overallAverage : null,
      });
      setNotice(typeof payload?.warning === "string" ? payload.warning : "");
    setStatus("success");
    } catch {
      setStatus("error");
      setError("We could not reach the server. Check your internet connection and try again.");
    }
  }

  /* ====================================================================== */
  if (status === "success") {
    return (
      <SuccessScreen accent="brand" title="Evaluations submitted" notice={notice}>
        <p>
          Thank you, {mentor?.name}. Your final sheets for{" "}
          <strong className="text-ink-900">
            {result?.menteeCount} mentee{result?.menteeCount === 1 ? "" : "s"}
          </strong>{" "}
          have gone to {HOST_COMPANY.name} as one report.
          {result?.overallAverage != null && (
            <>
              {" "}
              Your average rating across the group was{" "}
              <strong className="text-ink-900">{result.overallAverage.toFixed(2)} out of 5</strong>.
            </>
          )}
        </p>
        <p className="mt-3 text-ink-500">That closes out the mentorship programme. Thank you.</p>
      </SuccessScreen>
    );
  }

  /* ====================================================================== */
  return (
    <>
      <SiteHeader showBack />

      <main className="flex-1 bg-ink-50">
        <FormBanner
          accent="brand"
          eyebrow="Mentor · End of programme"
          icon={Award}
          title="Final evaluation sheets"
          description="One rating sheet per mentee, submitted together as a single report. This runs once, at the end of the fellowship."
          wide
        />

        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-5xl space-y-5 px-4 pb-20 sm:px-6">
          {/* ---- 1. Details ---- */}
          <Panel
            accent="brand"
            step={1}
            title="Sheet details"
            subtitle="Select your name; your mentees come from the roster."
          >
            <MentorPicker selectedId={mentorId} onSelect={choose} />

            {mentor && status === "locked" && (
              <div className="mt-4">
                <StatusMessage tone="info" title="You have already submitted these sheets">
                  {mentor.name} has completed the final evaluations. They run once. If something
                  needs changing, email {HOST_COMPANY.email}.
                </StatusMessage>
              </div>
            )}

            {mentor && status !== "locked" && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="location" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="e.g. Abuja"
                    className={cn(
                      "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400",
                      ACCENT.brand.ring,
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="track" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">
                    Track
                  </label>
                  <input
                    id="track"
                    type="text"
                    value={track}
                    onChange={(event) => setTrack(event.target.value)}
                    placeholder="e.g. Data Analytics"
                    className={cn(
                      "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400",
                      ACCENT.brand.ring,
                    )}
                  />
                </div>
              </div>
            )}
          </Panel>

          {/* ---- 2. One sheet per mentee ---- */}
          {mentor && status !== "locked" && (
            <Panel
              accent="brand"
              step={2}
              title={`Rating sheets (${group.length})`}
              subtitle="Open each mentee and rate all eleven statements. 1 = Strongly Disagree, 5 = Strongly Agree."
            >
              {group.length === 0 ? (
                <StatusMessage tone="warning">
                  No mentees have been assigned to your group yet, so there is nothing to evaluate.
                  Please contact {HOST_COMPANY.name}.
                </StatusMessage>
              ) : (
                <>
                  <div className="mb-5 flex items-center gap-3 rounded-xl bg-ink-50 px-4 py-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-200">
                      <div
                        className="h-full rounded-full bg-brand-500 transition-all duration-500"
                        style={{ width: `${(completedSheets.length / group.length) * 100}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-ink-600">
                      {completedSheets.length} of {group.length} sheets done
                    </span>
                  </div>

                  <div className="space-y-3">
                    {group.map((student) => {
                      const sheet = sheets[student.id] ?? emptySheet();
                      const rated = ratedCount(MENTOR_FINAL_STATEMENTS, sheet.ratings);
                      const sheetDone = rated === MENTOR_FINAL_STATEMENTS.length;
                      const isOpen = openMenteeId === student.id;

                      return (
                        <div
                          key={student.id}
                          className={cn(
                            "overflow-hidden rounded-2xl border transition",
                            sheetDone ? "border-brand-200 bg-white" : "border-ink-200 bg-white",
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenMenteeId(isOpen ? null : student.id)}
                            aria-expanded={isOpen}
                            className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-ink-50/60"
                          >
                            <span
                              className={cn(
                                "grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold",
                                sheetDone ? "bg-brand-500 text-white" : "bg-ink-100 text-ink-500",
                              )}
                            >
                              {initials(student.firstName, student.lastName)}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-bold text-ink-900">
                                {fullName(student)}
                              </span>
                              <span className="block text-xs text-ink-500">
                                {rated} of {MENTOR_FINAL_STATEMENTS.length} statements rated
                              </span>
                            </span>
                            <ChevronDown
                              className={cn(
                                "size-5 shrink-0 text-ink-400 transition-transform",
                                isOpen && "rotate-180",
                              )}
                              aria-hidden
                            />
                          </button>

                          {isOpen && (
                            <div className="border-t border-ink-100 p-4 sm:p-5">
                              <LikertGrid
                                accent="brand"
                                statements={MENTOR_FINAL_STATEMENTS}
                                values={sheet.ratings}
                                onChange={(statementId, value) =>
                                  rate(student.id, statementId, value)
                                }
                                idPrefix={`mentor-final-${student.id}`}
                              />

                              <div className="mt-5">
                                <label
                                  htmlFor={`rec-${student.id}`}
                                  className="text-sm font-semibold text-ink-900"
                                >
                                  Other recommendations? Please share{" "}
                                  <span className="font-normal text-ink-400">(optional)</span>
                                </label>
                                <textarea
                                  id={`rec-${student.id}`}
                                  rows={3}
                                  value={sheet.recommendations}
                                  onChange={(event) => recommend(student.id, event.target.value)}
                                  placeholder={`Anything else ${HOST_COMPANY.name} should know about ${student.firstName}?`}
                                  className={cn(
                                    "mt-2.5 w-full resize-y rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm leading-relaxed text-ink-900 outline-none transition placeholder:text-ink-400",
                                    ACCENT.brand.ring,
                                  )}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Panel>
          )}

          {!complete && group.length > 0 && (
            <StatusMessage tone="info">
              {completedSheets.length} of {group.length} sheets are fully rated. Every statement is
              optional — you can submit with whatever you have filled in.
            </StatusMessage>
          )}

          {status === "error" && (
            <StatusMessage tone="error" title="Your sheets were not sent">
              {error}
            </StatusMessage>
          )}

          <FormActions
            accent="brand"
            icon={Send}
            submitLabel={`Submit ${group.length || ""} evaluation${group.length === 1 ? "" : "s"}`.replace("  ", " ")}
            submittingLabel="Sending…"
            canSubmit={
              Boolean(mentor) && group.length > 0 && status !== "locked" && status !== "checking"
            }
            submitting={status === "submitting"}
          />
        </form>
      </main>

      <SiteFooter />
    </>
  );
}
