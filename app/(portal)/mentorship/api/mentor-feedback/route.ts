import { NextResponse } from "next/server";

import { MONTHLY_MENTEE_QUESTIONS, withLabels } from "@/mentorship/data/forms";
import {
  fullName,
  getMentorById,
  getStudentById,
  groupLabel,
  monthLabel,
  periodOf,
} from "@/mentorship/data/program";
import { db, isDbConfigured, record } from "@/mentorship/lib/db";
import { mentorReportEmail, type MentorReportEmail } from "@/mentorship/lib/email-templates";
import { FEEDBACK_INBOX, deliver, isMailConfigured } from "@/mentorship/lib/mail";
import { prepareResources } from "@/mentorship/lib/uploads";

export const runtime = "nodejs";

interface MenteeEntryPayload {
  studentId: string;
  answers: Record<string, string>;
}

const fail = (message: string, status: number) =>
  NextResponse.json({ ok: false, message }, { status });

export async function POST(request: Request) {
  // Only refuse when the submission would have nowhere at all to go.
  if (!isMailConfigured() && !isDbConfigured()) {
    return fail(
      "Submissions are not configured yet. Add SMTP_USER and SMTP_PASS (or RESEND_API_KEY) to the server environment.",
      503,
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("We could not read your submission. Please try again.", 400);
  }

  /* ---- Mentor ---------------------------------------------------------- */
  const mentor = getMentorById(String(form.get("mentorId") ?? ""));
  if (!mentor) return fail("Please select your name from the mentor list.", 400);

  /* ---- Session date ---------------------------------------------------- */
  const sessionDate = String(form.get("sessionDate") ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(sessionDate)) {
    return fail("Please choose a valid session date.", 400);
  }
  const period = periodOf(sessionDate);

  /* ---- Per-mentee evaluation ------------------------------------------- */
  let parsed: MenteeEntryPayload[];
  try {
    parsed = JSON.parse(String(form.get("menteeFeedback") ?? "[]"));
    if (!Array.isArray(parsed)) throw new Error("not an array");
  } catch {
    return fail("The mentee feedback could not be read. Please try again.", 400);
  }


  // Resolve names/emails from our own roster rather than trusting the browser.
  const menteeFeedback: MentorReportEmail["menteeFeedback"] = [];
  const stored: Array<Record<string, unknown>> = [];

  for (const entry of parsed) {
    const student = getStudentById(String(entry?.studentId ?? ""));
    if (!student) return fail("One of the selected mentees was not recognised.", 400);
    // A mentor only reports on their own group; the picker enforces this too.
    if (student.groupId !== mentor.groupId) {
      return fail(`${fullName(student)} is not in your mentorship group.`, 400);
    }

    // Every question is optional; unanswered ones travel through as blanks and
    // are rendered as "—" in the email and the export.
    const raw = (entry?.answers ?? {}) as Record<string, string>;
    const answers = withLabels(MONTHLY_MENTEE_QUESTIONS, raw);

    menteeFeedback.push({ name: fullName(student), email: student.email, answers });
    stored.push({
      menteeId: student.id,
      name: fullName(student),
      email: student.email,
      answers: Object.fromEntries(answers.map((a) => [a.id, a.answer])),
    });
  }

  /* ---- General session comment ----------------------------------------- */
  const generalComment = String(form.get("generalComment") ?? "").trim();

  /* ---- Resources -------------------------------------------------------- */
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const { resources, attachments, error } = await prepareResources(files, "mentor-reports");
  if (error) return fail(error, 400);

  // Every question and the summary are optional, but a report with nothing in
  // it at all is not worth mailing to anyone.
  const isEmpty =
    menteeFeedback.length === 0 &&
    generalComment.length === 0 &&
    resources.length === 0 &&
    attachments.length === 0;

  if (isEmpty) {
    return fail("Please select a mentee, or add a comment, before submitting.", 400);
  }

  /* ---- Send ------------------------------------------------------------ */
  const payload: MentorReportEmail = {
    mentorName: mentor.name,
    groupLabel: groupLabel(mentor.groupId),
    monthLabel: monthLabel(period),
    sessionDate,
    menteeFeedback,
    generalComment,
    resources,
    attachmentNames: attachments.map((a) => a.filename),
  };

  /* ---- Record first ----------------------------------------------------- */
  // Written down before it is emailed, so a mail outage cannot cost a mentor
  // the report they just spent time filling in.
  const saved = await record("mentor-report", async () => {
    const sql = db();
    await sql`
      INSERT INTO mentor_reports
        (mentor_id, mentor_name, group_id, period, session_date, general_comment, mentee_feedback, resources)
      VALUES
        (${mentor.id}, ${mentor.name}, ${mentor.groupId}, ${period}, ${sessionDate},
         ${generalComment}, ${JSON.stringify(stored)}::jsonb, ${JSON.stringify(resources)}::jsonb)
    `;
  });

  /* ---- Send ------------------------------------------------------------- */
  // Routing rule: every per-mentee comment plus the general comment, in one
  // email, to the organiser only.
  const { delivered, reason } = await deliver("mentor-feedback", mentorReportEmail(payload), {
    to: FEEDBACK_INBOX,
    replyTo: mentor.email || undefined,
    attachments,
  });

  if (!delivered && !saved) {
    return fail(`Your report could not be saved or sent. ${reason ?? ""}`.trim(), 502);
  }

  return NextResponse.json({
    ok: true,
    saved,
    delivered,
    warning: delivered
      ? undefined
      : `Your report is saved and visible to the organiser, but the email copy did not go out. ${reason ?? ""}`.trim(),
    message: delivered ? `Report delivered to ${FEEDBACK_INBOX}` : "Report saved.",
    menteeCount: menteeFeedback.length,
    monthLabel: monthLabel(period),
    resourceCount: resources.length + attachments.length,
  });
}
