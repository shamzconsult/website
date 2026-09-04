"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Sparkles, Users } from "lucide-react-v1";

import { FormActions, FormBanner, Panel, SuccessScreen } from "@/mentorship/components/FormShell";
import { MentorPicker } from "@/mentorship/components/MentorPicker";
import { QuestionFields, allAnswered, answeredCount } from "@/mentorship/components/QuestionFields";
import { SiteFooter, SiteHeader } from "@/mentorship/components/SiteHeader";
import { StatusMessage } from "@/mentorship/components/StatusMessage";
import { MENTOR_INTAKE_QUESTIONS } from "@/mentorship/data/forms";
import { HOST_COMPANY, getMentorById, getStudentsInGroup, groupLabel } from "@/mentorship/data/program";

type Status = "idle" | "checking" | "locked" | "submitting" | "error" | "success";

/** The mentor's interest, expectations and background form — filled once. */
export default function MentorIntakePage() {
  const [mentorId, setMentorId] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  /** Set when the entry was saved but its email notification failed. */
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const mentor = getMentorById(mentorId);
  const group = mentor ? getStudentsInGroup(mentor.groupId) : [];
  // Every question is optional. `complete` only drives the gentle reminder
  // underneath the button - it never blocks the submission.
  const complete = allAnswered(MENTOR_INTAKE_QUESTIONS, answers);
  const answered = answeredCount(MENTOR_INTAKE_QUESTIONS, answers);

  /** Picking a name asks the server whether that mentor has already submitted. */
  function choose(nextId: string) {
    setMentorId(nextId);
    setStatus("checking");

    fetch(`/api/intake?role=mentor&personId=${encodeURIComponent(nextId)}`)
      .then((response) => response.json())
      .then((result) => setStatus(result?.submitted ? "locked" : "idle"))
      .catch(() => setStatus("idle"));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!mentor) return;

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "mentor", personId: mentor.id, answers }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus(response.status === 409 ? "locked" : "error");
        setError(result?.message ?? "Something went wrong. Please try again.");
        return;
      }

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
      <SuccessScreen accent="brand" title="Thank you — that's recorded" notice={notice}>
        <p>
          Your interest and expectations form has been sent to {HOST_COMPANY.name}. This one is
          filled once, at the start of the programme.
        </p>
        <p className="mt-3">
          Each month, come back to the{" "}
          <Link href="/mentor" className="font-semibold text-brand-600 underline">
            monthly report
          </Link>{" "}
          to evaluate your mentees.
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
          accent="brand"
          eyebrow="Mentor · Before we begin"
          icon={Sparkles}
          title="Your interest, expectations and info"
          description="A short profile so we can match expectations on both sides before the first session. Submitted once, at the start of the programme."
        />

        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-3xl space-y-5 px-4 pb-20 sm:px-6">
          <Panel accent="brand" step={1} title="Who are you?" subtitle="Select your name below.">
            <MentorPicker selectedId={mentorId} onSelect={choose} />

            {mentor && status !== "locked" && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3">
                <Users className="size-5 shrink-0 text-brand-500" aria-hidden />
                <p className="text-sm text-ink-700">
                  You are mentoring <strong className="text-ink-900">{group.length}</strong> mentee
                  {group.length === 1 ? "" : "s"} in {groupLabel(mentor.groupId)}.
                  {group.length === 0 &&
                    ` Mentees have not been assigned to your group yet — that is fine, fill this in anyway.`}
                </p>
              </div>
            )}

            {status === "locked" && mentor && (
              <div className="mt-4">
                <StatusMessage tone="info" title="You have already filled this in">
                  {mentor.name} has submitted the interest and expectations form. It can only be
                  filled once. If something needs changing, email {HOST_COMPANY.email}.
                </StatusMessage>
              </div>
            )}
          </Panel>

          <Panel
            accent="brand"
            step={2}
            title="Interest, expectations and other info"
            subtitle={`${MENTOR_INTAKE_QUESTIONS.length} questions about your work, your interests and your availability.`}
            disabled={!mentor || status === "locked"}
          >
            <QuestionFields
              accent="brand"
              questions={MENTOR_INTAKE_QUESTIONS}
              values={answers}
              onChange={(id, value) => setAnswers((prev) => ({ ...prev, [id]: value }))}
              idPrefix="mentor-intake"
              disabled={!mentor || status === "locked"}
            />
          </Panel>

          {status === "error" && (
            <StatusMessage tone="error" title="Your form was not sent">
              {error}
            </StatusMessage>
          )}

          <FormActions
            accent="brand"
            icon={Send}
            submitLabel="Submit my profile"
            submittingLabel="Sending…"
            canSubmit={Boolean(mentor) && status !== "locked" && status !== "checking"}
            submitting={status === "submitting"}
          />

          {mentor && status === "idle" && !complete && (
            <p className="text-center text-xs text-ink-500">
              {answered} of {MENTOR_INTAKE_QUESTIONS.length} answered. Every question is optional —
              you can submit whatever you have.
            </p>
          )}
        </form>
      </main>

      <SiteFooter />
    </>
  );
}
