import {
  HOST_COMPANY,
  MENTORS,
  PROGRAM,
  PROGRAM_MONTHS,
  STUDENTS,
  fullName,
  getMentorForStudent,
  getStudentsInGroup,
  monthLabel,
} from "@/mentorship/data/program";
import { CALL_MODES } from "@/mentorship/data/forms";
import { db, ensureSchema, isDbConfigured, type Row } from "@/mentorship/lib/db";
import { isCloudinaryConfigured } from "@/mentorship/lib/cloudinary";
import { isMailConfigured, mailSettings, verifyMail } from "@/mentorship/lib/mail";

export interface Rate {
  done: number;
  total: number;
  rate: number;
}

export interface MentorRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  groupId: number;
  menteeCount: number;
  contactable: boolean;
  intakeDone: boolean;
  monthly: Array<{ period: string; reports: number; submitted: boolean }>;
  monthsSubmitted: number;
  finalSheets: number;
  finalDone: boolean;
  callsLogged: number;
}

export interface MenteeRow {
  id: string;
  name: string;
  email: string;
  gender: string;
  groupId: number | null;
  mentorId: string | null;
  mentorName: string | null;
  intakeDone: boolean;
  finalDone: boolean;
  monthly: Array<{ period: string; covered: boolean; calls: number }>;
  monthsCovered: number;
  messages: number;
  calls: number;
}

export interface Totals {
  mentors: number;
  mentees: number;
  assignedMentees: number;
  unassignedMentees: number;
  monthlyReporting: { mentor: Rate; mentee: Rate };
  intake: { mentor: Rate; mentee: Rate };
  finalEvaluation: { mentor: Rate; mentee: Rate };
  calls: number;
  messages: number;
  reports: number;
  averageScores: { aboutMentors: number | null; aboutMentees: number | null };
}

export interface CallsMonth {
  period: string;
  /** "Aug 2026" */
  label: string;
  byMentor: number;
  byMentee: number;
  total: number;
}

export interface SubmissionsMonth {
  period: string;
  label: string;
  /** Everything a mentor filed that month. */
  mentor: number;
  /** Everything a mentee filed that month. */
  mentee: number;
  total: number;
  /** The same totals split by form, for the table under the chart. */
  breakdown: {
    mentorIntake: number;
    mentorReports: number;
    mentorCalls: number;
    mentorFinal: number;
    menteeIntake: number;
    menteeMessages: number;
    menteeCalls: number;
    menteeFinal: number;
  };
}

export interface Charts {
  /** Calls bucketed by the month the call happened. */
  callsByMonth: CallsMonth[];
  /** How those calls took place. Unstated modes are grouped as "Not stated". */
  callsByMode: Array<{ label: string; count: number }>;
  /** Who is logging them. */
  callsByMentor: Array<{ id: string; label: string; count: number }>;
  /** Every submission bucketed by the month it was received. */
  submissionsByMonth: SubmissionsMonth[];
}

export interface Overview {
  ok: boolean;
  health: {
    database: boolean;
    email: boolean;
    cloudinary: boolean;
    /** Why email is not working, when it is configured but the login fails. */
    emailReason?: string;
    /** The account the mail is sent from, so a typo is visible at a glance. */
    emailAccount?: string;
    /** Which route mail actually takes: Brevo's HTTPS API, or SMTP. */
    emailTransport?: "brevo" | "smtp";
    /** The verified sender address - the usual cause of a refused send. */
    emailFrom?: string;
  };
  months: string[];
  mentors: MentorRow[];
  mentees: MenteeRow[];
  totals: Totals | null;
  charts: Charts | null;
  message?: string;
}

/** Programme identity, so the dashboard header does not re-derive it. */
export const PROGRAM_SUMMARY = { ...PROGRAM, host: HOST_COMPANY };

export async function buildOverview(): Promise<Overview> {
  // Configured is not the same as working - an expired or mistyped app
  // password looks identical in the env. Actually log in and report the truth.
  const mail = isMailConfigured() ? await verifyMail() : { ok: false, reason: undefined };

  const health = {
    database: isDbConfigured(),
    email: mail.ok,
    cloudinary: isCloudinaryConfigured(),
    emailReason: mail.ok ? undefined : mail.reason,
    emailAccount: mailSettings().user,
    emailTransport: mailSettings().transport,
    emailFrom: mailSettings().from,
  };

  const empty = {
    health,
    months: PROGRAM_MONTHS,
    mentors: [] as MentorRow[],
    mentees: [] as MenteeRow[],
    totals: null,
    charts: null,
  };

  if (!health.database) {
    return {
      ...empty,
      ok: true,
      message:
        "No DATABASE_URL is set, so nothing is being recorded yet. Submissions are still being emailed.",
    };
  }

  try {
    await ensureSchema();
    const sql = db();

    const [menteeIntake, mentorIntake, reports, calls, messages, menteeFinals, mentorFinals] =
      await Promise.all([
        sql`SELECT mentee_id, created_at FROM mentee_intake`,
        sql`SELECT mentor_id, created_at FROM mentor_intake`,
        sql`SELECT mentor_id, period, mentee_feedback, created_at FROM mentor_reports`,
        sql`SELECT mentor_id, mentee_id, period, logged_by, mode, created_at FROM call_logs`,
        sql`SELECT mentee_id, created_at FROM mentee_messages`,
        sql`SELECT mentee_id, average, created_at FROM mentee_final_evaluations`,
        sql`SELECT mentor_id, mentee_id, average, created_at FROM mentor_final_evaluations`,
      ]);

    /* ---- Fast lookups -------------------------------------------------- */
    const menteeIntakeIds = idSet(menteeIntake, "mentee_id");
    const mentorIntakeIds = idSet(mentorIntake, "mentor_id");
    const menteeFinalIds = idSet(menteeFinals, "mentee_id");
    const mentorFinalPairs = new Set(
      mentorFinals.map((row) => `${String(row.mentor_id)}::${String(row.mentee_id)}`),
    );

    /** "mentorId::period" -> how many reports that mentor filed that month */
    const reportsByMentorMonth = new Map<string, number>();
    /** "menteeId::period" -> the mentee appeared in a report that month */
    const menteeCoverage = new Set<string>();

    for (const report of reports) {
      const key = `${String(report.mentor_id)}::${String(report.period)}`;
      reportsByMentorMonth.set(key, (reportsByMentorMonth.get(key) ?? 0) + 1);

      const feedback = (report.mentee_feedback ?? []) as Array<{ menteeId?: string }>;
      for (const entry of feedback) {
        if (entry?.menteeId) menteeCoverage.add(`${entry.menteeId}::${String(report.period)}`);
      }
    }

    const callsByMenteeMonth = tally(
      calls,
      (row) => `${String(row.mentee_id)}::${String(row.period)}`,
    );
    const callsByMentor = tally(calls, (row) => String(row.mentor_id));
    const messagesByMentee = tally(messages, (row) => String(row.mentee_id));

    /* ---- Mentors -------------------------------------------------------- */
    const mentors: MentorRow[] = MENTORS.map((mentor) => {
      const group = getStudentsInGroup(mentor.groupId);
      const monthly = PROGRAM_MONTHS.map((period) => {
        const filed = reportsByMentorMonth.get(`${mentor.id}::${period}`) ?? 0;
        return { period, reports: filed, submitted: filed > 0 };
      });

      const finalSheets = group.filter((student) =>
        mentorFinalPairs.has(`${mentor.id}::${student.id}`),
      ).length;

      return {
        id: mentor.id,
        name: mentor.name,
        email: mentor.email,
        phone: mentor.phone,
        groupId: mentor.groupId,
        menteeCount: group.length,
        contactable: mentor.email.trim().length > 0,
        intakeDone: mentorIntakeIds.has(mentor.id),
        monthly,
        monthsSubmitted: monthly.filter((month) => month.submitted).length,
        finalSheets,
        finalDone: group.length > 0 && finalSheets === group.length,
        callsLogged: callsByMentor.get(mentor.id) ?? 0,
      };
    });

    /* ---- Mentees -------------------------------------------------------- */
    const mentees: MenteeRow[] = STUDENTS.map((student) => {
      const mentor = getMentorForStudent(student);
      const monthly = PROGRAM_MONTHS.map((period) => ({
        period,
        covered: menteeCoverage.has(`${student.id}::${period}`),
        calls: callsByMenteeMonth.get(`${student.id}::${period}`) ?? 0,
      }));

      return {
        id: student.id,
        name: fullName(student),
        email: student.email,
        gender: student.gender,
        groupId: student.groupId,
        mentorId: mentor?.id ?? null,
        mentorName: mentor?.name ?? null,
        intakeDone: menteeIntakeIds.has(student.id),
        finalDone: menteeFinalIds.has(student.id),
        monthly,
        monthsCovered: monthly.filter((month) => month.covered).length,
        messages: messagesByMentee.get(student.id) ?? 0,
        calls: monthly.reduce((total, month) => total + month.calls, 0),
      };
    });

    /* ---- Completion rates ----------------------------------------------- */
    // Only mentees with a mentor can be reported on, so they are the honest
    // denominator for anything that depends on a pairing existing.
    const assigned = mentees.filter((mentee) => mentee.mentorId !== null);

    const totals: Totals = {
      mentors: mentors.length,
      mentees: mentees.length,
      assignedMentees: assigned.length,
      unassignedMentees: mentees.length - assigned.length,
      monthlyReporting: {
        mentor: rate(
          sum(mentors, (m) => m.monthsSubmitted),
          mentors.length * PROGRAM_MONTHS.length,
        ),
        mentee: rate(
          sum(assigned, (m) => m.monthsCovered),
          assigned.length * PROGRAM_MONTHS.length,
        ),
      },
      intake: {
        mentor: rate(
          count(mentors, (m) => m.intakeDone),
          mentors.length,
        ),
        mentee: rate(
          count(mentees, (m) => m.intakeDone),
          mentees.length,
        ),
      },
      finalEvaluation: {
        mentor: rate(
          count(mentors, (m) => m.finalDone),
          mentors.length,
        ),
        mentee: rate(
          count(mentees, (m) => m.finalDone),
          assigned.length,
        ),
      },
      calls: calls.length,
      messages: messages.length,
      reports: reports.length,
      averageScores: {
        // A sheet where nothing was rated stores a NULL average; Number(null)
        // is 0, which would drag the programme mean down, so drop it instead.
        aboutMentors: mean(menteeFinals.map((row) => numberOrNaN(row.average))),
        aboutMentees: mean(mentorFinals.map((row) => numberOrNaN(row.average))),
      },
    };

    /* ---- Chart feeds ----------------------------------------------------
     * Calls are bucketed by when the call happened (their `period`, derived
     * from call_date); everything else by when it was received (created_at).
     * The axis is the programme's own months plus any month rows actually
     * landed in, so nothing submitted early or late falls off the chart. */
    const callMonths = tally(calls, (row) => String(row.period));
    const axis = monthAxis([
      ...calls.map((row) => String(row.period)),
      ...[
        menteeIntake,
        mentorIntake,
        reports,
        calls,
        messages,
        menteeFinals,
        mentorFinals,
      ].flatMap((rows) => rows.map((row) => monthOf(row.created_at))),
    ]);

    const callsLoggedByMentor = tally(
      calls.filter((row) => String(row.logged_by) === "mentor"),
      (row) => String(row.period),
    );

    const received = (rows: Row[]) => tally(rows, (row) => monthOf(row.created_at));
    const menteeIntakeByMonth = received(menteeIntake);
    const mentorIntakeByMonth = received(mentorIntake);
    const reportsByMonth = received(reports);
    const messagesByMonth = received(messages);
    const menteeFinalsByMonth = received(menteeFinals);
    const mentorFinalsByMonth = received(mentorFinals);
    const callsReceived = {
      mentor: received(calls.filter((row) => String(row.logged_by) === "mentor")),
      mentee: received(calls.filter((row) => String(row.logged_by) !== "mentor")),
    };

    const charts: Charts = {
      callsByMonth: axis.map((period) => {
        const total = callMonths.get(period) ?? 0;
        const byMentor = callsLoggedByMentor.get(period) ?? 0;
        return { period, label: monthShort(period), byMentor, byMentee: total - byMentor, total };
      }),

      callsByMode: modeTally(calls),

      callsByMentor: mentors
        .map((mentor) => ({ id: mentor.id, label: mentor.name, count: mentor.callsLogged }))
        .sort((a, b) => b.count - a.count),

      submissionsByMonth: axis.map((period) => {
        const at = (counts: Map<string, number>) => counts.get(period) ?? 0;
        const breakdown = {
          mentorIntake: at(mentorIntakeByMonth),
          mentorReports: at(reportsByMonth),
          mentorCalls: at(callsReceived.mentor),
          mentorFinal: at(mentorFinalsByMonth),
          menteeIntake: at(menteeIntakeByMonth),
          menteeMessages: at(messagesByMonth),
          menteeCalls: at(callsReceived.mentee),
          menteeFinal: at(menteeFinalsByMonth),
        };
        const mentor =
          breakdown.mentorIntake +
          breakdown.mentorReports +
          breakdown.mentorCalls +
          breakdown.mentorFinal;
        const mentee =
          breakdown.menteeIntake +
          breakdown.menteeMessages +
          breakdown.menteeCalls +
          breakdown.menteeFinal;

        return { period, label: monthShort(period), mentor, mentee, total: mentor + mentee, breakdown };
      }),
    };

    return { ok: true, health, months: PROGRAM_MONTHS, mentors, mentees, totals, charts };
  } catch (error) {
    console.error("[overview] failed:", error);
    return {
      ...empty,
      ok: false,
      message: "We could not read the database. Check that DATABASE_URL is correct and reachable.",
    };
  }
}

/* --------------------------------------------------------------------------
 * Little helpers
 * ------------------------------------------------------------------------*/

const idSet = (rows: Row[], column: string) => new Set(rows.map((row) => String(row[column])));

/** A timestamptz (or anything Date can read) as its `YYYY-MM` bucket. */
function monthOf(value: unknown): string {
  const date = value instanceof Date ? value : new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

/**
 * The programme's own months, plus any month that rows actually landed in, in
 * order. Submissions that arrive before the programme starts or after it ends
 * still have to appear somewhere.
 */
function monthAxis(periods: string[]): string[] {
  const valid = periods.filter((period) => /^\d{4}-\d{2}$/.test(period));
  return [...new Set([...PROGRAM_MONTHS, ...valid])].sort();
}

/** "2026-08" -> "Aug 2026" */
function monthShort(period: string): string {
  const label = monthLabel(period);
  const [name, year] = label.split(" ");
  return year ? `${name.slice(0, 3)} ${year}` : label;
}

/**
 * Calls grouped by how they happened. The known modes keep their form order so
 * the chart does not reshuffle between refreshes; anything left blank (the mode
 * is optional) is gathered at the end rather than dropped.
 */
function modeTally(calls: Row[]): Array<{ label: string; count: number }> {
  const counts = tally(calls, (row) => String(row.mode ?? "").trim());
  const known = CALL_MODES.map((mode) => ({ label: mode, count: counts.get(mode) ?? 0 }));

  let unstated = 0;
  for (const [mode, count] of counts) {
    if (!(CALL_MODES as readonly string[]).includes(mode)) unstated += count;
  }

  return unstated > 0 ? [...known, { label: "Not stated", count: unstated }] : known;
}

function tally(rows: Row[], key: (row: Row) => string) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const k = key(row);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

const sum = <T,>(items: T[], of: (item: T) => number) =>
  items.reduce((total, item) => total + of(item), 0);

const count = <T,>(items: T[], matches: (item: T) => boolean) => items.filter(matches).length;

const rate = (done: number, total: number): Rate => ({
  done,
  total,
  rate: total === 0 ? 0 : (done / total) * 100,
});

const numberOrNaN = (value: unknown) => (value === null || value === undefined ? NaN : Number(value));

function mean(values: number[]): number | null {
  const usable = values.filter((value) => Number.isFinite(value));
  if (usable.length === 0) return null;
  return usable.reduce((total, value) => total + value, 0) / usable.length;
}
