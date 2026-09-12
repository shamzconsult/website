"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  CircleCheckBig,
  LoaderCircle,
  MessageSquareText,
  PhoneCall,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react-v1";

import { FileDropzone } from "@/mentorship/components/FileDropzone";
import { SiteFooter, SiteHeader } from "@/mentorship/components/SiteHeader";
import { StatusMessage } from "@/mentorship/components/StatusMessage";
import { StudentCombobox } from "@/mentorship/components/StudentCombobox";
import {
  PROGRAM,
  fullName,
  getMentorForStudent,
  groupLabel,
  isMentorContactable,
  type Student,
} from "@/mentorship/data/program";
import { cn } from "@/mentorship/lib/utils";

type Status = "idle" | "submitting" | "error" | "success";

export default function MenteePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  /** Set when the entry was saved but its email notification failed. */
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const mentor = student ? getMentorForStudent(student) : undefined;
  const canReachMentor = isMentorContactable(mentor);
  // Everything on this form is optional except sending *something* - either a
  // written message or an attached file.
  const hasContent = message.trim().length > 0 || files.length > 0;
  const canSubmit = Boolean(student) && canReachMentor && hasContent && status !== "submitting";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!student || !canSubmit) return;

    setStatus("submitting");
    setError("");

    const body = new FormData();
    body.append("studentId", student.id);
    body.append("message", message.trim());
    files.forEach((file) => body.append("files", file));

    try {
      const response = await fetch("/api/mentee-message", { method: "POST", body });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
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

  function reset() {
    setMessage("");
    setFiles([]);
    setStatus("idle");
    setNotice("");
    setError("");
  }

  /* ======================================================================
   * SUCCESS
   * ==================================================================== */
  if (status === "success") {
    return (
      <>
        <SiteHeader showBack />
        <main className="flex flex-1 items-center justify-center bg-ink-50 px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg rounded-3xl border border-ink-100 bg-white p-8 text-center shadow-xl sm:p-10"
          >
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-teal-100">
              <CircleCheckBig className="size-8 text-teal-600" aria-hidden />
            </span>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-bold text-ink-900">
              {notice ? "Message saved" : "Message sent"}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              {notice ? (
                <>
                  Your message for <strong className="text-ink-900">{mentor?.name}</strong> has been
                  recorded.
                </>
              ) : (
                <>
                  Your message is on its way to{" "}
                  <strong className="text-ink-900">{mentor?.name}</strong>. They will reply to you
                  directly by email.
                </>
              )}
            </p>

            {notice && (
              <div className="mt-5 text-left">
                <StatusMessage tone="warning" title="Saved, but not emailed">
                  {notice}
                </StatusMessage>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={reset}
                className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Send another message
              </button>
              <Link
                href="/"
                className="rounded-xl border border-ink-200 px-5 py-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
              >
                Back to home
              </Link>
            </div>
          </motion.div>
        </main>
        <SiteFooter />
      </>
    );
  }

  /* ======================================================================
   * FORM
   * ==================================================================== */
  return (
    <>
      <SiteHeader showBack />

      <main className="flex-1 bg-ink-50">
        {/* ---------- Banner ---------- */}
        <div className="relative overflow-hidden bg-ink-950 pb-16 pt-10 sm:pb-20">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="grid-texture absolute inset-0 opacity-60" />
            <div className="absolute -right-20 -top-24 size-80 rounded-full bg-teal-500/25 blur-[90px]" />
          </div>

          <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-300">
              <MessageSquareText className="size-3.5" aria-hidden />
              Mentee
            </span>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Message your mentor
            </h1>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-ink-300 sm:text-base">
              Ask a question, request guidance, or share something you would like your mentor to
              know. It goes straight to their inbox, with a copy to {PROGRAM.facilitator}.
            </p>

            <MenteeLinks />
          </div>
        </div>

        {/* ---------- Form ---------- */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-3xl space-y-5 px-4 pb-20 sm:px-6"
        >
          {/* ---- 1. Identify ---- */}
          <Panel step={1} title="Find yourself" subtitle="Search the participant list for your name.">
            <StudentCombobox selected={student} onSelect={setStudent} />

            {student && (
              <div className="mt-4">
                {canReachMentor ? (
                  <div className="flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3">
                    <ShieldCheck className="size-5 shrink-0 text-teal-600" aria-hidden />
                    <p className="text-sm text-ink-700">
                      Your message will be sent to{" "}
                      <strong className="text-ink-900">{mentor?.name}</strong>, your{" "}
                      {groupLabel(student.groupId)} mentor.
                    </p>
                  </div>
                ) : (
                  <StatusMessage tone="warning" title="Your mentor has not been set up yet">
                    {student.groupId === null ? (
                      <>
                        {fullName(student)} has not been assigned to a mentorship group yet, so we
                        cannot route your message.
                      </>
                    ) : (
                      <>
                        We do not have an email address on file for your {groupLabel(student.groupId)}{" "}
                        mentor yet.
                      </>
                    )}{" "}
                    Please contact {PROGRAM.facilitator} and try again once this is sorted.
                  </StatusMessage>
                )}
              </div>
            )}
          </Panel>

          {/* ---- 2. Message ---- */}
          <Panel
            step={2}
            title="Your question or comment"
            subtitle="Write as much or as little as you need."
            disabled={!student}
          >
            <label htmlFor="message" className="sr-only">
              Your message
            </label>
            <textarea
              id="message"
              rows={9}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={!student}
              placeholder="What would you like to ask or tell your mentor? For example: a concept you would like explained again, feedback on your progress, or guidance on your project…"
              className="w-full resize-y rounded-xl border border-ink-200 bg-white px-4 py-3.5 text-sm leading-relaxed text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-ink-50"
            />
          </Panel>

          {/* ---- 3. Attach ---- */}
          <Panel
            step={3}
            title="Attach a file"
            subtitle="Optional — a presentation, document or anything else you want to share."
            disabled={!student}
          >
            <FileDropzone
              files={files}
              onChange={setFiles}
              accent="teal"
              hint="PPTX, PDF, Word documents and more."
            />
          </Panel>

          {/* ---- Errors ---- */}
          {status === "error" && (
            <StatusMessage tone="error" title="Your message was not sent">
              {error}
            </StatusMessage>
          )}

          {/* ---- Submit ---- */}
          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Cancel
            </Link>

            <button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition",
                canSubmit
                  ? "bg-teal-600 shadow-lg shadow-teal-600/25 hover:bg-teal-700"
                  : "cursor-not-allowed bg-ink-300",
              )}
            >
              {status === "submitting" ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="size-4" aria-hidden />
                  Send to my mentor
                </>
              )}
            </button>
          </div>

          {student && !hasContent && canReachMentor && (
            <p className="text-center text-xs text-ink-500">
              Write a message or attach a file to enable sending.
            </p>
          )}
        </form>
      </main>

      <SiteFooter />
    </>
  );
}

/* ==========================================================================
 * The other things a mentee might have come here to do
 * ========================================================================== */
function MenteeLinks() {
  const links = [
    { href: "/mentee/intake", icon: Sparkles, label: "Interest & expectations", hint: "Once, at the start" },
    { href: "/call-log", icon: PhoneCall, label: "Log a call", hint: "After a session" },
    { href: "/mentee/final-evaluation", icon: Award, label: "Final evaluation", hint: "Once, at the end" },
  ];

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 backdrop-blur transition hover:border-teal-400/50 hover:bg-white/10"
        >
          <link.icon className="size-4 shrink-0 text-teal-300" aria-hidden />
          <span>
            <span className="block text-xs font-semibold text-white">{link.label}</span>
            <span className="block text-[10px] text-ink-400">{link.hint}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

/* ==========================================================================
 * Numbered card wrapper
 * ========================================================================== */
function Panel({
  step,
  title,
  subtitle,
  disabled = false,
  children,
}: {
  step: number;
  title: string;
  subtitle: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-ink-100 bg-white p-5 shadow-sm transition sm:p-7",
        disabled && "opacity-60",
      )}
    >
      <div className="mb-5 flex items-start gap-3.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
          {step}
        </span>
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-ink-900">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
