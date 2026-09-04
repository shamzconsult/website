"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  LoaderCircle,
  PhoneCall,
  Send,
  Sparkles,
  Users,
} from "lucide-react-v1";

import { FileDropzone } from "@/mentorship/components/FileDropzone";
import { MenteeMultiSelect } from "@/mentorship/components/MenteeMultiSelect";
import { MentorPicker } from "@/mentorship/components/MentorPicker";
import { QuestionFields, answeredCount, allAnswered } from "@/mentorship/components/QuestionFields";
import { SiteFooter, SiteHeader } from "@/mentorship/components/SiteHeader";
import { StatusMessage } from "@/mentorship/components/StatusMessage";
import { Stepper, type StepDefinition } from "@/mentorship/components/Stepper";
import { SuccessScreen } from "@/mentorship/components/FormShell";
import { MONTHLY_MENTEE_QUESTIONS } from "@/mentorship/data/forms";
import {
  HOST_COMPANY,
  PROGRAM,
  STUDENTS,
  fullName,
  getMentorById,
  groupLabel,
  monthLabel,
  periodOf,
} from "@/mentorship/data/program";
import { cn, formatLongDate, initials, todayIso } from "@/mentorship/lib/utils";

const STEPS: StepDefinition[] = [
  { title: "Session details", hint: "Who you are and when you met" },
  { title: "Your mentees", hint: "Select everyone covered this month" },
  { title: "Per-mentee evaluation", hint: "Six questions for each of them" },
  { title: "Session summary", hint: "General notes and resources" },
  { title: "Review & submit", hint: "Check it over, then send" },
];

type Status = "idle" | "submitting" | "error" | "success";

/** studentId -> questionId -> answer */
type Answers = Record<string, Record<string, string>>;

export default function MentorPage() {
  const [step, setStep] = useState(0);
  const [mentorId, setMentorId] = useState("");
  const [sessionDate, setSessionDate] = useState(todayIso());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [openMenteeId, setOpenMenteeId] = useState<string | null>(null);
  const [generalComment, setGeneralComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const [status, setStatus] = useState<Status>("idle");
  /** Set when the entry was saved but its email notification failed. */
  const [notice, setNotice] = useState("");
  const [message, setMessage] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);
  const mentor = getMentorById(mentorId);
  const period = periodOf(sessionDate);

  const selectedStudents = useMemo(
    () => selectedIds.map((id) => STUDENTS.find((s) => s.id === id)).filter((s) => s !== undefined),
    [selectedIds],
  );

  const answersFor = (studentId: string) => answers[studentId] ?? {};

  const completedStudents = selectedStudents.filter((student) =>
    allAnswered(MONTHLY_MENTEE_QUESTIONS, answersFor(student.id)),
  );
  const missingStudents = selectedStudents.filter(
    (student) => !allAnswered(MONTHLY_MENTEE_QUESTIONS, answersFor(student.id)),
  );

  /* ---------- Step gating ----------
   * Only the things the report cannot be filed without: who is reporting, when
   * the session was, and at least one mentee to report on. Every question and
   * the session summary are optional and can be left blank. */
  const stepIssue = ((): string | null => {
    if (step === 0) {
      if (!mentorId) return "Please select your name to continue.";
      if (!sessionDate) return "Please choose the date of the session.";
    }
    if (step === 1 && selectedIds.length === 0) {
      return "Select at least one mentee that you met with or discussed.";
    }
    return null;
  })();

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  /**
   * Switching mentor changes which mentees are on offer, so anything picked
   * for the previous mentor's group is cleared rather than silently submitted.
   */
  function chooseMentor(nextId: string) {
    setMentorId(nextId);
    setSelectedIds([]);
    setAnswers({});
    setOpenMenteeId(null);
  }

  function setAnswer(studentId: string, questionId: string, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [studentId]: { ...(prev[studentId] ?? {}), [questionId]: value },
    }));
  }

  /**
   * Arriving at the per-mentee step opens the first one that still needs work,
   * which saves a tap on the commonest path through the form.
   */
  function goToStep(next: number) {
    setStep(next);
    if (next === 2) {
      setOpenMenteeId((missingStudents[0] ?? selectedStudents[0])?.id ?? null);
    }
  }

  function goNext() {
    if (stepIssue) {
      setShowErrors(true);
      if (step === 2 && missingStudents[0]) setOpenMenteeId(missingStudents[0].id);
      return;
    }
    setShowErrors(false);
    goToStep(Math.min(step + 1, STEPS.length - 1));
  }

  function goBack() {
    setShowErrors(false);
    goToStep(Math.max(step - 1, 0));
  }

  /* ---------- Submit ---------- */
  async function handleSubmit() {
    if (!mentor) return;
    setStatus("submitting");
    setMessage("");

    const body = new FormData();
    body.append("mentorId", mentor.id);
    body.append("sessionDate", sessionDate);
    body.append("generalComment", generalComment.trim());
    body.append(
      "menteeFeedback",
      JSON.stringify(
        selectedStudents.map((student) => ({
          studentId: student.id,
          answers: answersFor(student.id),
        })),
      ),
    );
    files.forEach((file) => body.append("files", file));

    try {
      const response = await fetch("/api/mentor-feedback", { method: "POST", body });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setMessage(result?.message ?? "Something went wrong. Please try again.");
        return;
      }

      setNotice(typeof result?.warning === "string" ? result.warning : "");
    setStatus("success");
    } catch {
      setStatus("error");
      setMessage("We could not reach the server. Check your internet connection and try again.");
    }
  }

  function resetForm() {
    setStep(0);
    setSelectedIds([]);
    setAnswers({});
    setOpenMenteeId(null);
    setGeneralComment("");
    setFiles([]);
    setSessionDate(todayIso());
    setStatus("idle");
    setNotice("");
    setMessage("");
    setShowErrors(false);
  }

  /* ======================================================================
   * SUCCESS SCREEN
   * ==================================================================== */
  if (status === "success") {
    return (
      <SuccessScreen
        accent="brand"
        title="Report submitted"
        notice={notice}
        actions={
          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Submit another report
          </button>
        }
      >
        <p>
          Thank you, {mentor?.name}. Your evaluation of{" "}
          <strong className="text-ink-900">
            {selectedStudents.length} mentee{selectedStudents.length === 1 ? "" : "s"}
          </strong>{" "}
          for {monthLabel(period)} has been delivered to{" "}
          <strong className="text-ink-900">{HOST_COMPANY.email}</strong>.
        </p>
      </SuccessScreen>
    );
  }

  /* ======================================================================
   * FORM
   * ==================================================================== */
  return (
    <>
      <SiteHeader showBack />

      <main className="flex-1 bg-ink-50">
        {/* ---------- Page banner ---------- */}
        <div className="relative overflow-hidden bg-ink-950 pb-16 pt-10 sm:pb-20">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="grid-texture absolute inset-0 opacity-60" />
            <div className="absolute -right-20 -top-24 size-80 rounded-full bg-brand-600/30 blur-[90px]" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-300">
              <ClipboardList className="size-3.5" aria-hidden />
              Mentor
            </span>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Monthly session report
            </h1>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-ink-300 sm:text-base">
              Six questions about each mentee you worked with this month. This report goes directly
              to {PROGRAM.facilitator}.
            </p>

            <MentorLinks />
          </div>
        </div>

        {/* ---------- Body ---------- */}
        <div ref={topRef} className="mx-auto mt-10 max-w-6xl px-4 pb-20 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            {/* Stepper */}
            <aside className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start lg:p-6">
              <Stepper steps={STEPS} current={step} onSelect={goToStep} />
            </aside>

            {/* Step panel */}
            <section className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm sm:p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* ============ STEP 0 — SESSION DETAILS ============ */}
                  {step === 0 && (
                    <div>
                      <StepHeading
                        title="Session details"
                        description="Select your name and the date this mentorship session took place. The month is taken from that date."
                      />

                      <div className="mt-7">
                        <MentorPicker selectedId={mentorId} onSelect={chooseMentor} />
                      </div>

                      <div className="mt-7">
                        <label
                          htmlFor="sessionDate"
                          className="flex items-center gap-2 text-sm font-semibold text-ink-900"
                        >
                          <CalendarDays className="size-4 text-brand-500" aria-hidden />
                          Date of the session
                        </label>
                        <input
                          id="sessionDate"
                          type="date"
                          value={sessionDate}
                          max={todayIso()}
                          onChange={(event) => setSessionDate(event.target.value)}
                          className="mt-3 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 shadow-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 sm:max-w-xs"
                        />
                        {sessionDate && (
                          <p className="mt-2 text-xs text-ink-500">
                            {formatLongDate(sessionDate)} — filed under{" "}
                            <strong className="text-ink-700">{monthLabel(period)}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ============ STEP 1 — MENTEES ============ */}
                  {step === 1 && (
                    <div>
                      <StepHeading
                        title="Which mentees did you cover?"
                        description="Only your own mentees are listed. Select everyone who attended or was discussed this month."
                      />
                      <div className="mt-6">
                        <MenteeMultiSelect
                          selectedIds={selectedIds}
                          onChange={setSelectedIds}
                          mentorGroupId={mentor?.groupId}
                        />
                      </div>
                    </div>
                  )}

                  {/* ============ STEP 2 — PER-MENTEE EVALUATION ============ */}
                  {step === 2 && (
                    <div>
                      <StepHeading
                        title="Per-mentee evaluation"
                        description="Open each mentee and answer what you can — every question is optional. Everything here goes into one report for the organiser."
                      />

                      <div className="mt-5 flex items-center gap-3 rounded-xl bg-ink-50 px-4 py-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-200">
                          <div
                            className="h-full rounded-full bg-brand-500 transition-all duration-500"
                            style={{
                              width: `${selectedStudents.length ? (completedStudents.length / selectedStudents.length) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-ink-600">
                          {completedStudents.length} of {selectedStudents.length} done
                        </span>
                      </div>

                      <div className="mt-5 space-y-3">
                        {selectedStudents.map((student, index) => {
                          const values = answersFor(student.id);
                          const done = answeredCount(MONTHLY_MENTEE_QUESTIONS, values);
                          const isDone = done === MONTHLY_MENTEE_QUESTIONS.length;
                          const isOpen = openMenteeId === student.id;

                          return (
                            <div
                              key={student.id}
                              className={cn(
                                "overflow-hidden rounded-2xl border bg-white transition",
                                isDone ? "border-brand-200" : "border-ink-200",
                              )}
                            >
                              <button
                                type="button"
                                aria-expanded={isOpen}
                                onClick={() => setOpenMenteeId(isOpen ? null : student.id)}
                                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-ink-50/60"
                              >
                                <span
                                  className={cn(
                                    "grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold",
                                    isDone ? "bg-brand-500 text-white" : "bg-ink-100 text-ink-500",
                                  )}
                                >
                                  {initials(student.firstName, student.lastName)}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-bold text-ink-900">
                                    {fullName(student)}
                                  </span>
                                  <span className="block text-xs text-ink-500">
                                    {done} of {MONTHLY_MENTEE_QUESTIONS.length} questions answered
                                  </span>
                                </span>
                                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-ink-400">
                                  {index + 1}/{selectedStudents.length}
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
                                  <QuestionFields
                                    accent="brand"
                                    questions={MONTHLY_MENTEE_QUESTIONS}
                                    values={values}
                                    onChange={(questionId, value) =>
                                      setAnswer(student.id, questionId, value)
                                    }
                                    idPrefix={`monthly-${student.id}`}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ============ STEP 3 — SESSION SUMMARY ============ */}
                  {step === 3 && (
                    <div>
                      <StepHeading
                        title="Session summary"
                        description="Cover the month as a whole — what was discussed and achieved, challenges, and any recommendations for the group."
                      />

                      <div className="mt-6">
                        <label
                          htmlFor="generalComment"
                          className="text-sm font-semibold text-ink-900"
                        >
                          General session comment{" "}
                          <span className="font-normal text-ink-400">(optional)</span>
                        </label>
                        <textarea
                          id="generalComment"
                          rows={8}
                          value={generalComment}
                          onChange={(event) => setGeneralComment(event.target.value)}
                          placeholder="What was discussed? What was achieved? Any challenges, observations or recommendations for the group?"
                          className={cn(
                            "mt-3 w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm leading-relaxed text-ink-900 outline-none transition placeholder:text-ink-400 focus:ring-4 focus:ring-brand-100",
                            "border-ink-200 focus:border-brand-400",
                          )}
                        />
                      </div>

                      <div className="mt-8">
                        <p className="text-sm font-semibold text-ink-900">Session resources</p>
                        <p className="mb-3 mt-1 text-xs text-ink-500">
                          Optional — slides, PDFs or documents you used. These are uploaded to
                          Cloudinary and shared as links.
                        </p>
                        <FileDropzone files={files} onChange={setFiles} accent="brand" />
                      </div>
                    </div>
                  )}

                  {/* ============ STEP 4 — REVIEW ============ */}
                  {step === 4 && (
                    <div>
                      <StepHeading
                        title="Review your report"
                        description={`Check everything below, then send it to ${HOST_COMPANY.email}.`}
                      />

                      <div className="mt-6 space-y-5">
                        <ReviewBlock title="Session details" onEdit={() => goToStep(0)}>
                          <dl className="grid gap-3 sm:grid-cols-2">
                            <ReviewItem label="Mentor" value={mentor?.name ?? "—"} />
                            <ReviewItem
                              label="Group"
                              value={mentor ? groupLabel(mentor.groupId) : "—"}
                            />
                            <ReviewItem label="Session date" value={formatLongDate(sessionDate)} />
                            <ReviewItem label="Reporting month" value={monthLabel(period)} />
                          </dl>
                        </ReviewBlock>

                        <ReviewBlock
                          title={`Per-mentee evaluation (${selectedStudents.length})`}
                          onEdit={() => goToStep(2)}
                        >
                          <ul className="space-y-3">
                            {selectedStudents.map((student) => (
                              <li
                                key={student.id}
                                className="rounded-xl border border-ink-100 bg-white p-3.5"
                              >
                                <p className="flex items-center gap-2 text-sm font-bold text-ink-900">
                                  <span className="grid size-7 place-items-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                                    {initials(student.firstName, student.lastName)}
                                  </span>
                                  {fullName(student)}
                                </p>
                                <dl className="mt-3 space-y-2.5">
                                  {MONTHLY_MENTEE_QUESTIONS.map((question) => (
                                    <div key={question.id}>
                                      <dt className="text-[11px] font-semibold text-brand-600">
                                        {question.label}
                                      </dt>
                                      <dd className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed text-ink-600">
                                        {answersFor(student.id)[question.id]?.trim()}
                                      </dd>
                                    </div>
                                  ))}
                                </dl>
                              </li>
                            ))}
                          </ul>
                        </ReviewBlock>

                        <ReviewBlock title="General session comment" onEdit={() => goToStep(3)}>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-600">
                            {generalComment.trim()}
                          </p>
                        </ReviewBlock>

                        <ReviewBlock title={`Resources (${files.length})`} onEdit={() => goToStep(3)}>
                          {files.length === 0 ? (
                            <p className="text-sm text-ink-500">No files attached.</p>
                          ) : (
                            <ul className="space-y-1.5 text-sm text-ink-700">
                              {files.map((file) => (
                                <li key={file.name} className="truncate">
                                  • {file.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </ReviewBlock>
                      </div>

                      {status === "error" && (
                        <div className="mt-6">
                          <StatusMessage tone="error" title="Your report was not sent">
                            {message}
                          </StatusMessage>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* ---------- Inline validation ---------- */}
              {showErrors && stepIssue && step !== 4 && (
                <div className="mt-6">
                  <StatusMessage tone="warning">{stepIssue}</StatusMessage>
                </div>
              )}

              {/* ---------- Navigation ---------- */}
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={status === "submitting"}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink-200 px-5 py-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 disabled:opacity-50"
                  >
                    <ArrowLeft className="size-4" aria-hidden />
                    Back
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink-200 px-5 py-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
                  >
                    <ArrowLeft className="size-4" aria-hidden />
                    Cancel
                  </Link>
                )}

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition",
                      stepIssue
                        ? "bg-ink-300"
                        : "bg-brand-500 shadow-lg shadow-brand-500/25 hover:bg-brand-600",
                    )}
                  >
                    Continue
                    <ArrowRight className="size-4" aria-hidden />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === "submitting"}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "submitting" ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" aria-hidden />
                        Sending report…
                      </>
                    ) : (
                      <>
                        <Send className="size-4" aria-hidden />
                        Submit report
                      </>
                    )}
                  </button>
                )}
              </div>
            </section>
          </div>

          {/* ---------- Context footer ---------- */}
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-ink-500">
            <Users className="size-3.5" aria-hidden />
            Delivered to {HOST_COMPANY.email}
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

/* ==========================================================================
 * The other things a mentor might have come here to do
 * ========================================================================== */
function MentorLinks() {
  const links = [
    { href: "/mentor/intake", icon: Sparkles, label: "Interest & expectations", hint: "Once, at the start" },
    // { href: "/call-log", icon: PhoneCall, label: "Log a call", hint: "After every call" },
    { href: "/mentor/final-evaluation", icon: Award, label: "Final evaluation", hint: "Once, at the end" },
  ];

  return (
    <div className="mt-6 flex flex-wrap gap-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 backdrop-blur transition hover:border-brand-400/50 hover:bg-white/10"
        >
          <link.icon className="size-4 shrink-0 text-brand-400" aria-hidden />
          <span>
            <span className="block text-md font-semibold text-white">{link.label}</span>
            <span className="block text-[20px] text-ink-400">{link.hint}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

/* ==========================================================================
 * Small presentational helpers
 * ========================================================================== */
function StepHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-ink-900 sm:text-2xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">{description}</p>
    </div>
  );
}

function ReviewBlock({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-4 sm:p-5">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-xs font-semibold text-brand-600 transition hover:text-brand-700 hover:underline"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-ink-900">{value}</dd>
    </div>
  );
}
