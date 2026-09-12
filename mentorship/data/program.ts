
import roster from "@/mentorship/data/roster.json";

export type GroupId = number;

export interface Mentor {
  id: string;
  name: string;
  /** Mentee messages are delivered here. Empty string = not yet provided. */
  email: string;
  phone: string;
  groupId: GroupId;
}

export interface Student {
  id: string;
  /** Full name exactly as written in roster.json. */
  name: string;
  firstName: string;
  lastName: string;
  /** Empty string = not yet provided. */
  email: string;
  gender: string;
  /** null = not yet assigned to a group. */
  groupId: GroupId | null;
  location: string;
  track: string;
}


export const HOST_COMPANY = {
  name: roster.hostCompany.name,
  email: roster.hostCompany.email,
} as const;

export const PROGRAM = {
  name: roster.program.name,
  sponsor: roster.program.sponsor,
  facilitator: roster.hostCompany.name,
  cadence: roster.program.cadence,
  /** Every submission is reported to this address. */
  feedbackInbox: roster.hostCompany.email,
} as const;

/** The monthly cycles the fellowship runs, as `YYYY-MM` strings. */
export const PROGRAM_MONTHS: string[] = [...roster.program.months];

/* --------------------------------------------------------------------------
 * ID GENERATION
 * ------------------------------------------------------------------------*/
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Splits "Sophia Uzoamaka Okoro" into { firstName: "Sophia Uzoamaka", lastName: "Okoro" }. */
function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0] ?? "", lastName: "" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts[parts.length - 1] };
}

/* --------------------------------------------------------------------------
 * MENTORS
 * ------------------------------------------------------------------------*/
export const MENTORS: Mentor[] = roster.mentors.map((mentor, index) => ({
  id: slugify(mentor.name) || `mentor-${index + 1}`,
  name: mentor.name,
  email: mentor.email ?? "",
  phone: mentor.phone ?? "",
  groupId: mentor.groupId,
}));

/* --------------------------------------------------------------------------
 * MENTEES
 * ------------------------------------------------------------------------*/
interface MenteeSeed {
  name: string;
  email?: string;
  gender?: string;
  groupId?: number | null;
  location?: string;
  track?: string;
}

export const STUDENTS: Student[] = (roster.mentees as MenteeSeed[]).map((mentee, index) => ({
  id: `${slugify(mentee.name) || "mentee"}-${index + 1}`,
  name: mentee.name,
  ...splitName(mentee.name),
  email: mentee.email ?? "",
  gender: mentee.gender ?? "",
  groupId: mentee.groupId ?? null,
  location: mentee.location ?? "",
  track: mentee.track ?? "",
}));

/* --------------------------------------------------------------------------
 * LOOKUP HELPERS - used across the app, no need to edit
 * ------------------------------------------------------------------------*/
export const fullName = (student: Student) => student.name;

export const getStudentById = (id: string) => STUDENTS.find((s) => s.id === id);

export const getMentorById = (id: string) => MENTORS.find((m) => m.id === id);

export const getMentorByGroup = (groupId: GroupId | null) =>
  groupId === null ? undefined : MENTORS.find((m) => m.groupId === groupId);

/** The mentor a given mentee reports to, or undefined if not yet assigned. */
export const getMentorForStudent = (student: Student) => getMentorByGroup(student.groupId);

/** A mentor can only receive mentee messages once an email address is on file. */
export const isMentorContactable = (mentor: Mentor | undefined): boolean =>
  Boolean(mentor && mentor.email.trim().length > 0);

export const getStudentsInGroup = (groupId: GroupId) =>
  STUDENTS.filter((s) => s.groupId === groupId);

export const groupLabel = (groupId: GroupId | null) =>
  groupId === null ? "Unassigned" : "Group " + groupId;

/* --------------------------------------------------------------------------
 * MONTHS
 * ------------------------------------------------------------------------*/
/** "2026-08" -> "August 2026" */
export function monthLabel(period: string) {
  const [year, month] = period.split("-").map(Number);
  if (!year || !month) return period;
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** The `YYYY-MM` bucket a `YYYY-MM-DD` date falls into. */
export const periodOf = (isoDate: string) => isoDate.slice(0, 7);
