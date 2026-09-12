"use client";

import { useState } from "react";
import { Award, Send } from "lucide-react-v1";

import { FormActions, FormBanner, Panel, SuccessScreen } from "@/mentorship/components/FormShell";
import { LikertGrid, ratedCount } from "@/mentorship/components/LikertGrid";
import { SiteFooter, SiteHeader } from "@/mentorship/components/SiteHeader";
import { StatusMessage } from "@/mentorship/components/StatusMessage";
import { StudentCombobox } from "@/mentorship/components/StudentCombobox";
import { ACCENT } from "@/mentorship/components/accents";
import { MENTEE_FINAL_STATEMENTS, type LikertValue } from "@/mentorship/data/forms";
import { HOST_COMPANY, fullName, getMentorForStudent, type Student } from "@/mentorship/data/program";
import { cn } from "@/mentorship/lib/utils";

type Status = "idle" | "checking" | "locked" | "submitting" | "error" | "success";

/**
 * Section 6.0 — Mentee's Final Evaluation Sheet.
 *
 * Runs once, at the end of the programme, and rates the mentor across eleven
 * statements on the same 1–5 scale as the paper sheet.
 */
export default function MenteeFinalEvaluationPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [location, setLocation] = useState("");
  const [track, setTrack] = useState("");
  const [ratings, setRatings] = useState<Record<string, LikertValue | undefined>>({});
  const [comments, setComments] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  /** Set when the entry was saved but its email notification failed. */
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [average, setAverage] = useState<number | null>(null);

  const mentor = student ? getMentorForStudent(student) : undefined;
  const done = ratedCount(MENTEE_FINAL_STATEMENTS, ratings);

  /** Prefills location/track from the roster and checks for a previous sheet. */
  function choose(next: Student | null) {
    setStudent(next);
    setStatus("idle");
    if (!next) return;

    setLocation(next.location);
    setTrack(next.track);
    setStatus("checking");

    fetch(`/api/final-evaluation?role=mentee&personId=${encodeURIComponent(next.id)}`)
      .then((response) => response.json())
      .then((result) => setStatus(result?.submitted ? "locked" : "idle"))
      .catch(() => setStatus("idle"));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!student) return;

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/final-evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "mentee",
          personId: student.id,
          location: location.trim(),
          track: track.trim(),
          ratings,
          comments: comments.trim(),
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus(response.status === 409 ? "locked" : "error");
        setError(result?.message ?? "Something went wrong. Please try again.");
        return;
      }

      setAverage(typeof result.average === "number" ? result.average : null);
      setNotice(typeof result?.warning === "string" ? result.warning : "");
    setStatus("success");
    } catch {
      setStatus("error");
      setError("We could not reach the server. Check your internet connection and try again.");
    }
  }

  /* ====================================================================== */
  if (status === "success") {
    return (
      <SuccessScreen accent="teal" title="Evaluation submitted" notice={notice}>
        <p>
          Thank you. Your final evaluation of{" "}
          <strong className="text-ink-900">{mentor?.name}</strong> has been sent to{" "}
          {HOST_COMPANY.name}.
          {average !== null && (
            <>
              {" "}
              You rated the mentorship{" "}
              <strong className="text-ink-900">{average.toFixed(2)} out of 5</strong> on average.
            </>
          )}
        </p>
        <p className="mt-3 text-ink-500">This sheet is submitted once, so you are all done.</p>
      </SuccessScreen>
    );
  }

  /* ====================================================================== */
  return (
    <>
      <SiteHeader showBack />

      <main className="flex-1 bg-ink-50">
        <FormBanner
          accent="teal"
          eyebrow="Mentee · End of programme"
          icon={Award}
          title="Final evaluation sheet"
          description="Rate how the mentorship went across eleven statements. This runs once, at the end of the fellowship."
          wide
        />

        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-5xl space-y-5 px-4 pb-20 sm:px-6">
          {/* ---- 1. Header details ---- */}
          <Panel
            accent="teal"
            step={1}
            title="Sheet details"
            subtitle="Find yourself; the mentor's name comes from the roster."
          >
            <StudentCombobox selected={student} onSelect={choose} />

            {student && status === "locked" && (
              <div className="mt-4">
                <StatusMessage tone="info" title="You have already submitted this sheet">
                  {fullName(student)} has completed the final evaluation. It runs once. If something
                  needs changing, email {HOST_COMPANY.email}.
                </StatusMessage>
              </div>
            )}

            {student && status !== "locked" && (
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Field label="Mentor's name">
                  <p className="rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3 text-sm font-semibold text-ink-900">
                    {mentor?.name ?? "Not yet assigned"}
                  </p>
                </Field>

                <Field label="Location">
                  <input
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="e.g. Abuja"
                    className={cn(
                      "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400",
                      ACCENT.teal.ring,
                    )}
                  />
                </Field>

                <Field label="Track">
                  <input
                    type="text"
                    value={track}
                    onChange={(event) => setTrack(event.target.value)}
                    placeholder="e.g. Data Analytics"
                    className={cn(
                      "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400",
                      ACCENT.teal.ring,
                    )}
                  />
                </Field>
              </div>
            )}

            {student && !mentor && status !== "locked" && (
              <div className="mt-4">
                <StatusMessage tone="warning" title="No mentor assigned">
                  You have not been placed in a mentorship group, so there is no mentor to evaluate.
                  Please contact {HOST_COMPANY.name}.
                </StatusMessage>
              </div>
            )}
          </Panel>

          {/* ---- 2. The grid ---- */}
          <Panel
            accent="teal"
            step={2}
            title="Your ratings"
            subtitle="1 = Strongly Disagree, 5 = Strongly Agree. Rate what you can — every statement is optional."
            disabled={!student || !mentor || status === "locked"}
          >
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-ink-50 px-4 py-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-200">
                <div
                  className="h-full rounded-full bg-teal-600 transition-all duration-500"
                  style={{ width: `${(done / MENTEE_FINAL_STATEMENTS.length) * 100}%` }}
                />
              </div>
              <span className="shrink-0 text-xs font-semibold text-ink-600">
                {done} of {MENTEE_FINAL_STATEMENTS.length} rated
              </span>
            </div>

            <LikertGrid
              accent="teal"
              statements={MENTEE_FINAL_STATEMENTS}
              values={ratings}
              onChange={(id, value) => setRatings((prev) => ({ ...prev, [id]: value }))}
              idPrefix="mentee-final"
            />

            <div className="mt-6">
              <label htmlFor="comments" className="text-sm font-semibold text-ink-900">
                Other comments or recommendations{" "}
                <span className="font-normal text-ink-400">(optional)</span>
              </label>
              <textarea
                id="comments"
                rows={4}
                value={comments}
                onChange={(event) => setComments(event.target.value)}
                placeholder="Anything you would like the organiser to know that the ratings do not capture."
                className={cn(
                  "mt-2.5 w-full resize-y rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm leading-relaxed text-ink-900 outline-none transition placeholder:text-ink-400",
                  ACCENT.teal.ring,
                )}
              />
            </div>
          </Panel>

          {status === "error" && (
            <StatusMessage tone="error" title="Your sheet was not sent">
              {error}
            </StatusMessage>
          )}

          <FormActions
            accent="teal"
            icon={Send}
            submitLabel="Submit evaluation"
            submittingLabel="Sending…"
            canSubmit={Boolean(student && mentor) && status !== "locked" && status !== "checking"}
            submitting={status === "submitting"}
          />
        </form>
      </main>

      <SiteFooter />
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-500">{label}</p>
      {children}
    </div>
  );
}
