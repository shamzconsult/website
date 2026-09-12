import { NextResponse } from "next/server";

import { isCallMode } from "@/mentorship/data/forms";
import {
  HOST_COMPANY,
  fullName,
  getMentorById,
  getMentorForStudent,
  getStudentById,
  getStudentsInGroup,
  type Mentor,
  periodOf,
  type Student,
} from "@/mentorship/data/program";
import { db, isDbConfigured, record } from "@/mentorship/lib/db";
import { callLogEmail } from "@/mentorship/lib/email-templates";
import { FEEDBACK_INBOX, deliver, isMailConfigured } from "@/mentorship/lib/mail";

export const runtime = "nodejs";

const fail = (message: string, status: number) =>
  NextResponse.json({ ok: false, message }, { status });

export async function POST(request: Request) {
  // Only refuse when the entry would have nowhere at all to go.
  if (!isMailConfigured() && !isDbConfigured()) {
    return fail("Call logging is not configured yet. Please contact the organiser.", 503);
  }

  let body: {
    loggedBy?: string;
    personId?: string;
    /** Mentors log one call against everyone who was on it. */
    counterpartIds?: string[];
    /** The single-mentee shape the form used to send. Still accepted. */
    counterpartId?: string;
    callDate?: string;
    mode?: string;
    note?: string;
  };
  try {
    body = await request.json();
  } catch {
    return fail("We could not read your entry. Please try again.", 400);
  }

  const loggedBy = body.loggedBy === "mentor" ? "mentor" : body.loggedBy === "mentee" ? "mentee" : null;
  if (!loggedBy) return fail("Please say whether you are the mentor or the mentee.", 400);

  let mentor: Mentor | undefined;
  let mentees: Student[];

  if (loggedBy === "mentor") {
    mentor = getMentorById(String(body.personId ?? ""));
    if (!mentor) return fail("Please select your name from the mentor list.", 400);

    const requested = Array.isArray(body.counterpartIds)
      ? body.counterpartIds
      : [body.counterpartId ?? ""];

    // Duplicates would each become a row, so the same mentee is only counted once.
    const ids = [...new Set(requested.map((id) => String(id ?? "")).filter(Boolean))];
    if (ids.length === 0) return fail("Please select the mentee you spoke with.", 400);

    mentees = [];
    for (const id of ids) {
      const student = getStudentById(id);
      if (!student) return fail("One of the selected mentees was not recognised.", 400);
      if (student.groupId !== mentor.groupId) {
        return fail(`${fullName(student)} is not in your mentorship group.`, 400);
      }
      mentees.push(student);
    }
  } else {
    const student = getStudentById(String(body.personId ?? ""));
    if (!student) return fail("Please find and select your name from the list.", 400);

    mentor = getMentorForStudent(student);
    if (!mentor) {
      return fail(
        `You have not been assigned to a mentorship group yet. Please contact ${HOST_COMPANY.name}.`,
        409,
      );
    }
    mentees = [student];
  }

  /* ---- Date, mode, note ------------------------------------------------- */
  const callDate = String(body.callDate ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(callDate)) return fail("Please choose a valid date.", 400);

  // Both optional. An unrecognised or missing mode is simply left unstated
  // rather than blocking the entry.
  const rawMode = String(body.mode ?? "").trim();
  const mode = isCallMode(rawMode) ? rawMode : "";

  const note = String(body.note ?? "").trim();

  /* ---- Send -------------------------------------------------------------
   * One call, one email — however many mentees it covered. */
  const loggerName = loggedBy === "mentor" ? mentor.name : fullName(mentees[0]);
  const loggerEmail = loggedBy === "mentor" ? mentor.email : mentees[0].email;

  // Everyone on the call gets a copy, so both sides see the same record.
  const copies =
    loggedBy === "mentor"
      ? mentees.map((student) => student.email).filter(Boolean)
      : [mentor.email].filter(Boolean);

  /* ---- Record first ------------------------------------------------------
   * The log is the thing that matters; the email is a notification of it. So
   * the row is written before the send is attempted, and an unreachable mail
   * server no longer throws the entry away.
   * ----------------------------------------------------------------------*/
  // One row per mentee keeps every existing count — per mentee, per month, per
  // mentor — reading exactly as it did when a call could only cover one person.
  const saved = await record("call-log", async () => {
    const sql = db();
    for (const student of mentees) {
      await sql`
        INSERT INTO call_logs
          (logged_by, mentor_id, mentor_name, mentee_id, mentee_name, call_date, period, mode, note)
        VALUES
          (${loggedBy}, ${mentor.id}, ${mentor.name}, ${student.id}, ${fullName(student)},
           ${callDate}, ${periodOf(callDate)}, ${mode}, ${note})
      `;
    }
  });

  const { delivered, reason } = await deliver(
    "call-log",
    callLogEmail({
      loggedBy,
      loggerName,
      mentorName: mentor.name,
      menteeNames: mentees.map(fullName),
      callDate,
      mode,
      note,
    }),
    {
      to: FEEDBACK_INBOX,
      cc: copies.length > 0 ? copies : undefined,
      replyTo: loggerEmail || undefined,
    },
  );

  if (!delivered && !saved) {
    return fail(`Your entry could not be saved or sent. ${reason ?? ""}`.trim(), 502);
  }

  return NextResponse.json({
    ok: true,
    saved,
    delivered,
    warning: delivered
      ? undefined
      : `Your entry is logged, but the email copy did not go out. ${reason ?? ""}`.trim(),
    message: mentees.length === 1 ? "Call logged." : `Call logged for ${mentees.length} mentees.`,
    mentorName: mentor.name,
    menteeNames: mentees.map(fullName),
    menteeCount: mentees.length,
    /** So the mentor UI can show how many of their group are still unlogged. */
    groupSize: getStudentsInGroup(mentor.groupId).length,
  });
}
