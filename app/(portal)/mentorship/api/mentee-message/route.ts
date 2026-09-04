import { NextResponse } from "next/server";

import {
  HOST_COMPANY,
  fullName,
  getMentorForStudent,
  getStudentById,
  groupLabel,
  isMentorContactable,
} from "@/mentorship/data/program";
import { db, isDbConfigured, record } from "@/mentorship/lib/db";
import { menteeMessageEmail, type MenteeMessageEmail } from "@/mentorship/lib/email-templates";
import { FEEDBACK_INBOX, deliver, isMailConfigured } from "@/mentorship/lib/mail";
import { prepareResources } from "@/mentorship/lib/uploads";

export const runtime = "nodejs";

const fail = (message: string, status: number) =>
  NextResponse.json({ ok: false, message }, { status });

export async function POST(request: Request) {
  // With neither a mailbox nor a database there is nowhere for the message to
  // go, and that is the only reason to refuse it outright.
  if (!isMailConfigured() && !isDbConfigured()) {
    return fail(
      "Messaging is not configured yet. Add SMTP_USER and SMTP_PASS (or RESEND_API_KEY) to the server environment.",
      503,
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("We could not read your submission. Please try again.", 400);
  }

  /* ---- Who is sending? -------------------------------------------------- */
  const student = getStudentById(String(form.get("studentId") ?? ""));
  if (!student) return fail("Please find and select your name from the list.", 400);

  /* ---- Who does it go to? ----------------------------------------------- */
  const mentor = getMentorForStudent(student);
  if (!mentor) {
    return fail(
      `You have not been assigned to a mentorship group yet, so we cannot route your message. Please contact ${HOST_COMPANY.name}.`,
      409,
    );
  }
  if (!isMentorContactable(mentor)) {
    return fail(
      `${mentor.name}'s email address has not been added yet, so your message cannot be delivered. Please contact ${HOST_COMPANY.name}.`,
      409,
    );
  }

  /* ---- The message ------------------------------------------------------ */
  // Optional: a mentee may want to send nothing but a file.
  const message = String(form.get("message") ?? "").trim();

  /* ---- Resources -------------------------------------------------------- */
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const { resources, attachments, error } = await prepareResources(files, "mentee-messages");
  if (error) return fail(error, 400);

  // The one thing we cannot send is an empty envelope.
  if (!message && files.length === 0) {
    return fail("Please write a message or attach a file before sending.", 400);
  }

  /* ---- Send ------------------------------------------------------------- */
  const payload: MenteeMessageEmail = {
    studentName: fullName(student),
    studentEmail: student.email,
    groupLabel: groupLabel(student.groupId),
    mentorName: mentor.name,
    message,
    resources,
    attachmentNames: attachments.map((a) => a.filename),
  };

  /* ---- Record first ------------------------------------------------------
   * The message is written down before it is emailed. Mail servers are the
   * fragile half of this: if the send fails the mentee's words are still kept
   * and visible to the organiser, instead of being lost with a 502.
   * ----------------------------------------------------------------------*/
  const saved = await record("mentee-message", async () => {
    const sql = db();
    await sql`
      INSERT INTO mentee_messages
        (mentee_id, mentee_name, mentee_email, mentor_id, mentor_name, group_id, message, resources)
      VALUES
        (${student.id}, ${fullName(student)}, ${student.email}, ${mentor.id}, ${mentor.name},
         ${student.groupId}, ${message}, ${JSON.stringify(resources)}::jsonb)
    `;
  });

  /* ---- Send ------------------------------------------------------------- */
  // Routing rule: the mentor's own address, with a copy to the organiser.
  const { delivered, reason } = await deliver("mentee-message", menteeMessageEmail(payload), {
    to: mentor.email,
    cc: FEEDBACK_INBOX,
    // So the mentor can simply hit reply and reach the mentee.
    replyTo: student.email || undefined,
    attachments,
  });

  // Nothing kept and nothing sent is the only true failure.
  if (!delivered && !saved) {
    return fail(`Your message could not be sent. ${reason ?? ""}`.trim(), 502);
  }

  return NextResponse.json({
    ok: true,
    saved,
    delivered,
    message: delivered
      ? `Message delivered to ${mentor.name}`
      : `Message saved for ${mentor.name}`,
    warning: delivered
      ? undefined
      : `Your message is saved and ${HOST_COMPANY.name} can see it, but the email to ${mentor.name} did not go out. ${reason ?? ""}`.trim(),
    mentorName: mentor.name,
    resourceCount: resources.length + attachments.length,
  });
}
