"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, ShieldCheck, Sparkles } from "lucide-react-v1";

import { FormActions, FormBanner, Panel, SuccessScreen } from "@/mentorship/components/FormShell";
import { QuestionFields, allAnswered, answeredCount } from "@/mentorship/components/QuestionFields";
import { SiteFooter, SiteHeader } from "@/mentorship/components/SiteHeader";
import { StatusMessage } from "@/mentorship/components/StatusMessage";
import { StudentCombobox } from "@/mentorship/components/StudentCombobox";
import { MENTEE_INTAKE_QUESTIONS } from "@/mentorship/data/forms";
import {
  HOST_COMPANY,
  fullName,
  getMentorForStudent,
  groupLabel,
  type Student,
} from "@/mentorship/data/program";

type Status = "idle" | "checking" | "locked" | "submitting" | "error" | "success";

export default function MenteeIntakePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  /** Set when the entry was saved but its email notification failed. */
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const mentor = student ? getMentorForStudent(student) : undefined;
  // Every question is optional. `complete` only drives the gentle reminder
  // underneath the button - it never blocks the submission.
  const complete = allAnswered(MENTEE_INTAKE_QUESTIONS, answers);
  const answered = answeredCount(MENTEE_INTAKE_QUESTIONS, answers);

  /**
   * Picking a name asks the server whether that mentee has already submitted.
   * The lock is enforced server-side too; this just saves someone typing out
   * four answers before finding out they will be refused.
   */
  function choose(next: Student | null) {
    setStudent(next);
    setStatus("idle");
    if (!next) return;

    setStatus("checking");
    fetch(`/api/intake?role=mentee&personId=${encodeURIComponent(next.id)}`)
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
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "mentee", personId: student.id, answers }),
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
      <SuccessScreen accent="teal" title="Thank you — that's recorded" notice={notice}>
        <p>
          Your interest and expectations have been sent to {HOST_COMPANY.name}
          {mentor ? ` and shared with ${mentor.name}` : ""}. This form is filled once, so there is
          nothing more to do here.
        </p>
        <p className="mt-3">
          When your mentorship gets going, use the{" "}
          <Link href="/mentee" className="font-semibold text-teal-700 underline">
            message channel
          </Link>{" "}
          to reach your mentor.
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
          accent="teal"
          eyebrow="Mentee · Before we begin"
          icon={Sparkles}
          title="Your interest and expectations"
          description="Tell your mentor what you are hoping for before the first session. This form is submitted once, at the start of the programme."
        />

        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-3xl space-y-5 px-4 pb-20 sm:px-6">
          {/* ---- 1. Identify ---- */}
          <Panel
            accent="teal"
            step={1}
            title="Find yourself"
            subtitle="Search the participant list for your name."
          >
            <StudentCombobox selected={student} onSelect={choose} />

            {student && status !== "locked" && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3">
                <ShieldCheck className="size-5 shrink-0 text-teal-600" aria-hidden />
                <p className="text-sm text-ink-700">
                  {mentor ? (
                    <>
                      Your answers go to {HOST_COMPANY.name} and to{" "}
                      <strong className="text-ink-900">{mentor.name}</strong>, your{" "}
                      {groupLabel(student.groupId)} mentor.
                    </>
                  ) : (
                    <>
                      You have not been assigned to a group yet, so your answers go to{" "}
                      {HOST_COMPANY.name} and will be passed on once your mentor is set.
                    </>
                  )}
                </p>
              </div>
            )}

            {status === "locked" && student && (
              <div className="mt-4">
                <StatusMessage tone="info" title="You have already filled this in">
                  {fullName(student)} has submitted the interest and expectations form. It can only
                  be filled once. If something needs changing, email {HOST_COMPANY.email}.
                </StatusMessage>
              </div>
            )}
          </Panel>

          {/* ---- 2. Questions ---- */}
          <Panel
            accent="teal"
            step={2}
            title="Interest and expectations"
            subtitle="Four questions. Write as much or as little as feels right."
            disabled={!student || status === "locked"}
          >
            <QuestionFields
              accent="teal"
              questions={MENTEE_INTAKE_QUESTIONS}
              values={answers}
              onChange={(id, value) => setAnswers((prev) => ({ ...prev, [id]: value }))}
              idPrefix="mentee-intake"
              disabled={!student || status === "locked"}
            />
          </Panel>

          {status === "error" && (
            <StatusMessage tone="error" title="Your form was not sent">
              {error}
            </StatusMessage>
          )}

          <FormActions
            accent="teal"
            icon={Send}
            submitLabel="Submit my expectations"
            submittingLabel="Sending…"
            canSubmit={Boolean(student) && status !== "locked" && status !== "checking"}
            submitting={status === "submitting"}
          />

          {student && status === "idle" && !complete && (
            <p className="text-center text-xs text-ink-500">
              {answered} of {MENTEE_INTAKE_QUESTIONS.length} answered. Every question is optional —
              you can submit whatever you have.
            </p>
          )}
        </form>
      </main>

      <SiteFooter />
    </>
  );
}
