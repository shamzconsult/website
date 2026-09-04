import { NextResponse } from "next/server";

import { MENTEE_INTAKE_QUESTIONS, MENTOR_INTAKE_QUESTIONS, withLabels } from "@/mentorship/data/forms";
import {
  HOST_COMPANY,
  fullName,
  getMentorById,
  getMentorForStudent,
  getStudentById,
  getStudentsInGroup,
  groupLabel,
} from "@/mentorship/data/program";
import {
  BRAND,
  TEAL,
  acknowledgementEmail,
  menteeIntakeEmail,
  mentorIntakeEmail,
} from "@/mentorship/lib/email-templates";
import {
  FEEDBACK_INBOX,
  deliver,
  isMailConfigured,
  sendQuietly,
} from "@/mentorship/lib/mail";
import { db, ensureSchema, isDbConfigured, record } from "@/mentorship/lib/db";

export const runtime = "nodejs";

const fail = (message: string, status: number) =>
  NextResponse.json({ ok: false, message }, { status });

export async function GET(request: Request) {
  const url = new URL(request.url);
  const role = url.searchParams.get("role");
  const personId = url.searchParams.get("personId") ?? "";

  if (role !== "mentee" && role !== "mentor") return fail("Unknown role.", 400);
  if (!personId) return fail("Missing personId.", 400);

  // Without a database we cannot know, so we let them through rather than
  // blocking a legitimate first submission.
  if (!isDbConfigured()) return NextResponse.json({ ok: true, submitted: false, tracked: false });

  try {
    await ensureSchema();
    const sql = db();
    const rows =
      role === "mentee"
        ? await sql`SELECT created_at FROM mentee_intake WHERE mentee_id = ${personId} LIMIT 1`
        : await sql`SELECT created_at FROM mentor_intake WHERE mentor_id = ${personId} LIMIT 1`;

    return NextResponse.json({
      ok: true,
      tracked: true,
      submitted: rows.length > 0,
      submittedAt: rows[0]?.created_at ?? null,
    });
  } catch (error) {
    console.error("[intake] status check failed:", error);
    return NextResponse.json({ ok: true, submitted: false, tracked: false });
  }
}

export async function POST(request: Request) {
  // Only refuse when the submission would have nowhere at all to go.
  if (!isMailConfigured() && !isDbConfigured()) {
    return fail("Submissions are not configured yet. Please contact the organiser.", 503);
  }

  let body: { role?: string; personId?: string; answers?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return fail("We could not read your submission. Please try again.", 400);
  }

  const answers = body.answers ?? {};
  const personId = String(body.personId ?? "");

  if (body.role === "mentee") return submitMenteeIntake(personId, answers);
  if (body.role === "mentor") return submitMentorIntake(personId, answers);
  return fail("Unknown role.", 400);
}

/* -------------------------------------------------------------------------- */

async function submitMenteeIntake(personId: string, raw: Record<string, string>) {
  const student = getStudentById(personId);
  if (!student) return fail("Please find and select your name from the list.", 400);

  // Every question is optional - a blank answer is recorded as a blank.
  const answers = withLabels(MENTEE_INTAKE_QUESTIONS, raw);

  if (await alreadySubmitted("mentee", personId)) {
    return fail(
      "You have already submitted your interest and expectations form. It can only be filled once.",
      409,
    );
  }

  const mentor = getMentorForStudent(student);

  const email = menteeIntakeEmail({
    studentName: fullName(student),
    studentEmail: student.email,
    gender: student.gender,
    groupLabel: groupLabel(student.groupId),
    mentorName: mentor?.name ?? "",
    answers,
  });

  // Recorded before it is emailed: an intake form can only be filled once, so
  // losing it to a mail outage would lock the mentee out of resubmitting.
  const saved = await record("mentee-intake", async () => {
    const sql = db();
    await sql`
      INSERT INTO mentee_intake
        (mentee_id, mentee_name, mentee_email, mentor_id, mentor_name, answers)
      VALUES
        (${student.id}, ${fullName(student)}, ${student.email}, ${mentor?.id ?? ""},
         ${mentor?.name ?? ""}, ${JSON.stringify(objectOf(answers))}::jsonb)
      ON CONFLICT (mentee_id) DO NOTHING
    `;
  });

  // The organiser is the record-keeper; the mentor gets a copy so they can
  // read their mentee's expectations before the first session.
  const { delivered, reason } = await deliver("mentee-intake", email, {
    to: FEEDBACK_INBOX,
    cc: mentor?.email || undefined,
    replyTo: student.email || undefined,
  });

  if (!delivered && !saved) {
    return fail(`Your form could not be saved or sent. ${reason ?? ""}`.trim(), 502);
  }

  await sendQuietly(
    "mentee intake acknowledgement",
    acknowledgementEmail(student.firstName, "interest and expectations form", TEAL, [
      ["Form", "Mentee's Interest and Expectations"],
      ["Group", groupLabel(student.groupId)],
      ["Mentor", mentor?.name ?? "Not yet assigned"],
    ]),
    { to: student.email },
  );

  return NextResponse.json({
    ok: true,
    saved,
    delivered,
    warning: delivered
      ? undefined
      : `Your form is saved, but the email copy did not go out. ${reason ?? ""}`.trim(),
    message: delivered
      ? `Your interest and expectations form has been sent to ${HOST_COMPANY.name}.`
      : `Your interest and expectations form has been recorded for ${HOST_COMPANY.name}.`,
  });
}

async function submitMentorIntake(personId: string, raw: Record<string, string>) {
  const mentor = getMentorById(personId);
  if (!mentor) return fail("Please select your name from the mentor list.", 400);

  // Every question is optional - a blank answer is recorded as a blank.
  const answers = withLabels(MENTOR_INTAKE_QUESTIONS, raw);

  if (await alreadySubmitted("mentor", personId)) {
    return fail(
      "You have already submitted your interest and expectations form. It can only be filled once.",
      409,
    );
  }

  const email = mentorIntakeEmail({
    mentorName: mentor.name,
    mentorEmail: mentor.email,
    mentorPhone: mentor.phone,
    groupLabel: groupLabel(mentor.groupId),
    menteeCount: getStudentsInGroup(mentor.groupId).length,
    answers,
  });

  const saved = await record("mentor-intake", async () => {
    const sql = db();
    await sql`
      INSERT INTO mentor_intake (mentor_id, mentor_name, mentor_email, answers)
      VALUES (${mentor.id}, ${mentor.name}, ${mentor.email}, ${JSON.stringify(objectOf(answers))}::jsonb)
      ON CONFLICT (mentor_id) DO NOTHING
    `;
  });

  const { delivered, reason } = await deliver("mentor-intake", email, {
    to: FEEDBACK_INBOX,
    replyTo: mentor.email || undefined,
  });

  if (!delivered && !saved) {
    return fail(`Your form could not be saved or sent. ${reason ?? ""}`.trim(), 502);
  }

  await sendQuietly(
    "mentor intake acknowledgement",
    acknowledgementEmail(mentor.name, "interest and expectations form", BRAND, [
      ["Form", "Mentor's Interest, Expectations and other info"],
      ["Group", groupLabel(mentor.groupId)],
      ["Mentees assigned", String(getStudentsInGroup(mentor.groupId).length)],
    ]),
    { to: mentor.email },
  );

  return NextResponse.json({
    ok: true,
    saved,
    delivered,
    warning: delivered
      ? undefined
      : `Your form is saved, but the email copy did not go out. ${reason ?? ""}`.trim(),
    message: delivered
      ? `Your interest and expectations form has been sent to ${HOST_COMPANY.name}.`
      : `Your interest and expectations form has been recorded for ${HOST_COMPANY.name}.`,
  });
}

/* -------------------------------------------------------------------------- */

const objectOf = (answers: Array<{ id: string; answer: string }>) =>
  Object.fromEntries(answers.map((answer) => [answer.id, answer.answer]));

/** Server-side enforcement of the once-only rule. */
async function alreadySubmitted(role: "mentee" | "mentor", personId: string): Promise<boolean> {
  if (!isDbConfigured()) return false;
  try {
    await ensureSchema();
    const sql = db();
    const rows =
      role === "mentee"
        ? await sql`SELECT 1 FROM mentee_intake WHERE mentee_id = ${personId} LIMIT 1`
        : await sql`SELECT 1 FROM mentor_intake WHERE mentor_id = ${personId} LIMIT 1`;
    return rows.length > 0;
  } catch (error) {
    console.error("[intake] duplicate check failed:", error);
    return false;
  }
}
