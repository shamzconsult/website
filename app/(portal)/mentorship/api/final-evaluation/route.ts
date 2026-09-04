import { NextResponse } from "next/server";

import { MENTEE_FINAL_STATEMENTS, MENTOR_FINAL_STATEMENTS } from "@/mentorship/data/forms";
import {
  HOST_COMPANY,
  fullName,
  getMentorById,
  getMentorForStudent,
  getStudentById,
  getStudentsInGroup,
} from "@/mentorship/data/program";
import { db, ensureSchema, isDbConfigured, record } from "@/mentorship/lib/db";
import {
  BRAND,
  TEAL,
  acknowledgementEmail,
  averageOf,
  menteeFinalEmail,
  mentorFinalEmail,
  type LikertAnswer,
} from "@/mentorship/lib/email-templates";
import {
  FEEDBACK_INBOX,
  deliver,
  isMailConfigured,
  sendQuietly,
} from "@/mentorship/lib/mail";

export const runtime = "nodejs";

const fail = (message: string, status: number) =>
  NextResponse.json({ ok: false, message }, { status });

export async function GET(request: Request) {
  const url = new URL(request.url);
  const role = url.searchParams.get("role");
  const personId = url.searchParams.get("personId") ?? "";

  if (role !== "mentee" && role !== "mentor") return fail("Unknown role.", 400);
  if (!personId) return fail("Missing personId.", 400);
  if (!isDbConfigured()) return NextResponse.json({ ok: true, submitted: false, tracked: false });

  try {
    await ensureSchema();
    const sql = db();
    const rows =
      role === "mentee"
        ? await sql`SELECT created_at FROM mentee_final_evaluations WHERE mentee_id = ${personId} LIMIT 1`
        : await sql`SELECT created_at FROM mentor_final_evaluations WHERE mentor_id = ${personId} LIMIT 1`;

    return NextResponse.json({
      ok: true,
      tracked: true,
      submitted: rows.length > 0,
      submittedAt: rows[0]?.created_at ?? null,
    });
  } catch (error) {
    console.error("[final-evaluation] status check failed:", error);
    return NextResponse.json({ ok: true, submitted: false, tracked: false });
  }
}

/* ==========================================================================
 * POST
 * ========================================================================== */
export async function POST(request: Request) {
  // Only refuse when the submission would have nowhere at all to go.
  if (!isMailConfigured() && !isDbConfigured()) {
    return fail("Submissions are not configured yet. Please contact the organiser.", 503);
  }

  let body: {
    role?: string;
    personId?: string;
    location?: string;
    track?: string;
    ratings?: Record<string, number>;
    comments?: string;
    sheets?: Array<{ menteeId: string; ratings: Record<string, number>; recommendations?: string }>;
  };
  try {
    body = await request.json();
  } catch {
    return fail("We could not read your submission. Please try again.", 400);
  }

  if (body.role === "mentee") return submitMenteeFinal(body);
  if (body.role === "mentor") return submitMentorFinal(body);
  return fail("Unknown role.", 400);
}

/* --------------------------------------------------------------------------
 * MENTEE — one sheet, about their mentor
 * ------------------------------------------------------------------------*/
async function submitMenteeFinal(body: {
  personId?: string;
  location?: string;
  track?: string;
  ratings?: Record<string, number>;
  comments?: string;
}) {
  const student = getStudentById(String(body.personId ?? ""));
  if (!student) return fail("Please find and select your name from the list.", 400);

  const mentor = getMentorForStudent(student);
  if (!mentor) {
    return fail(
      `You have not been assigned to a mentorship group, so there is no mentor to evaluate. Please contact ${HOST_COMPANY.name}.`,
      409,
    );
  }

  const ratings = readRatings(MENTEE_FINAL_STATEMENTS, body.ratings ?? {});

  if (await alreadySubmitted("mentee", student.id)) {
    return fail("You have already submitted your final evaluation sheet.", 409);
  }

  const average = averageOf(ratings.map((rating) => rating.value));
  const location = String(body.location ?? student.location ?? "").trim();
  const track = String(body.track ?? student.track ?? "").trim();
  const comments = String(body.comments ?? "").trim();

  // Recorded before it is emailed: the sheet can only be submitted once, so a
  // mail outage must not cost the mentee their answers.
  const saved = await record("mentee-final-evaluation", async () => {
    const sql = db();
    await sql`
      INSERT INTO mentee_final_evaluations
        (mentee_id, mentee_name, mentee_email, mentor_id, mentor_name, location, track, ratings, average, comments)
      VALUES
        (${student.id}, ${fullName(student)}, ${student.email}, ${mentor.id}, ${mentor.name},
         ${location}, ${track}, ${JSON.stringify(mapOf(ratings, MENTEE_FINAL_STATEMENTS))}::jsonb,
         ${average}, ${comments})
      ON CONFLICT (mentee_id) DO NOTHING
    `;
  });

  const { delivered, reason } = await deliver(
    "mentee-final-evaluation",
    menteeFinalEmail({
      studentName: fullName(student),
      studentEmail: student.email,
      mentorName: mentor.name,
      location,
      track,
      ratings,
      average,
      comments,
    }),
    { to: FEEDBACK_INBOX, replyTo: student.email || undefined },
  );

  if (!delivered && !saved) {
    return fail(`Your sheet could not be saved or sent. ${reason ?? ""}`.trim(), 502);
  }

  await sendQuietly(
    "mentee final evaluation acknowledgement",
    acknowledgementEmail(student.firstName, "final evaluation sheet", TEAL, [
      ["Form", "Mentee's Final Evaluation Sheet"],
      ["Mentor evaluated", mentor.name],
      ["Average score", average === null ? "" : `${average.toFixed(2)} / 5`],
    ]),
    { to: student.email },
  );

  return NextResponse.json({
    ok: true,
    saved,
    delivered,
    warning: delivered
      ? undefined
      : `Your sheet is saved, but the email copy did not go out. ${reason ?? ""}`.trim(),
    average,
    mentorName: mentor.name,
  });
}

/* --------------------------------------------------------------------------
 * MENTOR — one sheet per mentee, sent as a single report
 * ------------------------------------------------------------------------*/
async function submitMentorFinal(body: {
  personId?: string;
  location?: string;
  track?: string;
  sheets?: Array<{ menteeId: string; ratings: Record<string, number>; recommendations?: string }>;
}) {
  const mentor = getMentorById(String(body.personId ?? ""));
  if (!mentor) return fail("Please select your name from the mentor list.", 400);

  const submitted = body.sheets ?? [];
  if (submitted.length === 0) return fail("Please complete a sheet for at least one mentee.", 400);

  const sheets: Array<{
    menteeId: string;
    menteeName: string;
    menteeEmail: string;
    ratings: LikertAnswer[];
    average: number | null;
    recommendations: string;
  }> = [];

  for (const entry of submitted) {
    const student = getStudentById(String(entry?.menteeId ?? ""));
    if (!student) return fail("One of the selected mentees was not recognised.", 400);
    if (student.groupId !== mentor.groupId) {
      return fail(`${fullName(student)} is not in your mentorship group.`, 400);
    }

    const ratings = readRatings(MENTOR_FINAL_STATEMENTS, entry?.ratings ?? {});

    sheets.push({
      menteeId: student.id,
      menteeName: fullName(student),
      menteeEmail: student.email,
      ratings,
      average: averageOf(ratings.map((rating) => rating.value)),
      recommendations: String(entry?.recommendations ?? "").trim(),
    });
  }

  if (await alreadySubmitted("mentor", mentor.id)) {
    return fail("You have already submitted your final evaluation sheets.", 409);
  }

  const overallAverage = averageOf(sheets.map((sheet) => sheet.average));
  const location = String(body.location ?? "").trim();
  const track = String(body.track ?? "").trim();

  const saved = await record("mentor-final-evaluation", async () => {
    const sql = db();
    for (const sheet of sheets) {
      await sql`
        INSERT INTO mentor_final_evaluations
          (mentor_id, mentor_name, mentee_id, mentee_name, location, track, ratings, average, recommendations)
        VALUES
          (${mentor.id}, ${mentor.name}, ${sheet.menteeId}, ${sheet.menteeName}, ${location}, ${track},
           ${JSON.stringify(mapOf(sheet.ratings, MENTOR_FINAL_STATEMENTS))}::jsonb,
           ${sheet.average}, ${sheet.recommendations})
        ON CONFLICT (mentor_id, mentee_id) DO NOTHING
      `;
    }
  });

  const { delivered, reason } = await deliver(
    "mentor-final-evaluation",
    mentorFinalEmail({ mentorName: mentor.name, location, track, sheets, overallAverage }),
    { to: FEEDBACK_INBOX, replyTo: mentor.email || undefined },
  );

  if (!delivered && !saved) {
    return fail(`Your sheets could not be saved or sent. ${reason ?? ""}`.trim(), 502);
  }

  await sendQuietly(
    "mentor final evaluation acknowledgement",
    acknowledgementEmail(mentor.name, "final evaluation sheets", BRAND, [
      ["Form", "Mentor's Final Evaluation Sheet"],
      ["Mentees evaluated", `${sheets.length} of ${getStudentsInGroup(mentor.groupId).length}`],
      ["Overall average", overallAverage === null ? "" : `${overallAverage.toFixed(2)} / 5`],
    ]),
    { to: mentor.email },
  );

  return NextResponse.json({
    ok: true,
    saved,
    delivered,
    warning: delivered
      ? undefined
      : `Your sheets are saved, but the email copy did not go out. ${reason ?? ""}`.trim(),
    overallAverage,
    menteeCount: sheets.length,
  });
}

/* --------------------------------------------------------------------------
 * SHARED
 * ------------------------------------------------------------------------*/

/**
 * Reads whatever was rated. Every statement is optional, so anything that is
 * not a whole 1-5 comes back as null and renders as "Not answered" in the
 * email, the dashboard and the export. The average is taken over the answered
 * statements only.
 */
function readRatings(
  statements: Array<{ id: string; label: string }>,
  raw: Record<string, number>,
): LikertAnswer[] {
  return statements.map((statement) => {
    const value = Number(raw[statement.id]);
    const rated = Number.isInteger(value) && value >= 1 && value <= 5;
    return { label: statement.label, value: rated ? value : null };
  });
}

/** Ratings back into { statementId: value } for storage. */
const mapOf = (ratings: LikertAnswer[], statements: Array<{ id: string }>) =>
  Object.fromEntries(ratings.map((rating, index) => [statements[index].id, rating.value]));

async function alreadySubmitted(role: "mentee" | "mentor", personId: string): Promise<boolean> {
  if (!isDbConfigured()) return false;
  try {
    await ensureSchema();
    const sql = db();
    const rows =
      role === "mentee"
        ? await sql`SELECT 1 FROM mentee_final_evaluations WHERE mentee_id = ${personId} LIMIT 1`
        : await sql`SELECT 1 FROM mentor_final_evaluations WHERE mentor_id = ${personId} LIMIT 1`;
    return rows.length > 0;
  } catch (error) {
    console.error("[final-evaluation] duplicate check failed:", error);
    return false;
  }
}
