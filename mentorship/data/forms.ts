
export interface OpenQuestion {
  id: string;
  label: string;
  placeholder?: string;
  /** Rows for the textarea. Short factual answers get fewer. */
  rows?: number;
}

export interface LikertStatement {
  id: string;
  label: string;
}

/* ==========================================================================
 * 1. ONE-OFF INTAKE — filled once, before the mentorship starts
 * ========================================================================== */

export const MENTEE_INTAKE_QUESTIONS: OpenQuestion[] = [
  {
    id: "aspirations",
    label: "Please share your professional aspirations",
    placeholder: "Where do you want your career to go over the next few years?",
    rows: 4,
  },
  {
    id: "personal_interests",
    label: "What are your personal interests?",
    placeholder: "Hobbies, causes, things you enjoy outside work…",
    rows: 3,
  },
  {
    id: "mentor_qualities",
    label: "What are the qualities you look out for in your mentor?",
    placeholder: "What would make this mentorship work well for you?",
    rows: 3,
  },
  {
    id: "goal",
    label: "What goal do you want to achieve with your mentor?",
    placeholder: "One or two concrete things you want to walk away with.",
    rows: 4,
  },
];

export const MENTOR_INTAKE_QUESTIONS: OpenQuestion[] = [
  {
    id: "work_duties",
    label: "Please provide a brief description of your work duties",
    placeholder: "Your role and what you do day to day.",
    rows: 4,
  },
  {
    id: "professional_interests",
    label: "Please provide a list of your professional interests",
    placeholder: "Domains, technologies or areas of practice you care about.",
    rows: 3,
  },
  {
    id: "personal_interests",
    label: "Please share a list of your interests",
    placeholder: "Outside of work — hobbies, causes, communities.",
    rows: 3,
  },
  {
    id: "availability",
    label: "Please confirm your availability throughout the fellowship",
    placeholder: "e.g. Two evenings a month, Tuesdays and Thursdays after 6pm.",
    rows: 3,
  },
  {
    id: "goal",
    label: "What goal would you like to achieve through this exercise?",
    placeholder: "What a successful fellowship looks like from where you sit.",
    rows: 4,
  },
  {
    id: "previous_experience",
    label: "Please share your previous mentoring experience",
    placeholder: "Programmes, informal mentoring, or none at all — all useful.",
    rows: 4,
  },
];

/* ==========================================================================
 * 2. MONTHLY MENTOR FEEDBACK — asked once per mentee, every month
 * ========================================================================== */

export const MONTHLY_MENTEE_QUESTIONS: OpenQuestion[] = [
  {
    id: "growth_in_track",
    label: "Please share your view about the mentee's growth in the learning track",
    placeholder: "What has moved forward technically since you last reported?",
    rows: 3,
  },
  {
    id: "communication",
    label: "Please provide insight into your mentee's communication skills",
    placeholder: "Clarity, responsiveness, how they explain their work…",
    rows: 3,
  },
  {
    id: "highlight",
    label: "What is the highlight of your interaction?",
    placeholder: "The moment worth remembering from this month.",
    rows: 3,
  },
  {
    id: "concerns",
    label: "Is there any fear or concern shown by the mentee during the interaction?",
    placeholder: "Write \"None\" if there was nothing of concern.",
    rows: 3,
  },
  {
    id: "overall_journey",
    label: "Could you please provide an overall comment on the mentee's overall development journey?",
    placeholder: "The bigger picture across the programme so far.",
    rows: 3,
  },
  {
    id: "recommendation",
    label: "Please provide a recommendation to ITF-NECA on the mentee's performance",
    placeholder: "What should the sponsor know or do about this mentee?",
    rows: 3,
  },
];

/* ==========================================================================
 * 3. FINAL EVALUATION — Likert sheets, once at the end of the programme
 * ========================================================================== */

export const LIKERT_OPTIONS = [
  { value: 1, short: "1", label: "Strongly Disagree" },
  { value: 2, short: "2", label: "Disagree" },
  { value: 3, short: "3", label: "Neutral" },
  { value: 4, short: "4", label: "Agree" },
  { value: 5, short: "5", label: "Strongly Agree" },
] as const;

export type LikertValue = 1 | 2 | 3 | 4 | 5;

export const likertLabel = (value: number | null | undefined) =>
  LIKERT_OPTIONS.find((option) => option.value === value)?.label ?? "Not answered";

/** Section 6.0 — Mentee's Final Evaluation Sheet (rated about their mentor). */
export const MENTEE_FINAL_STATEMENTS: LikertStatement[] = [
  { id: "m1", label: "My mentor was available and accessible through the mentorship duration" },
  { id: "m2", label: "I enjoyed regular communication privilege with my mentor" },
  {
    id: "m3",
    label: "My mentor supported me to navigate challenging areas of my technical development",
  },
  {
    id: "m4",
    label: "I gained a lot of technical and professional development insight from my mentor",
  },
  { id: "m5", label: "My mentor provides useful feedback on regular basis during the program" },
  {
    id: "m6",
    label:
      "My mentor showed reasonable concern towards me and provided guidance on my area of concern",
  },
  { id: "m7", label: "My mentor displayed a high level of professionalism during sessions" },
  {
    id: "m8",
    label:
      "My problem solving, communication, networking and knowledge of my track became clearer and effective through my mentor's assistance",
  },
  {
    id: "m9",
    label: "I recommend my mentor for future personal and professional engagement activities",
  },
  {
    id: "m10",
    label:
      "Overall, the mentorship session added greatly to actualizing my intentions at ITF-NECA TSDP Data Analytics Training",
  },
  { id: "m11", label: "I recommend mentorship sessions in TIIDELab's future fellowships" },
];

/** Section 6.0 — Mentor's Final Evaluation Sheet (rated about each mentee). */
export const MENTOR_FINAL_STATEMENTS: LikertStatement[] = [
  { id: "t1", label: "My mentee was available, accessible and punctual throughout the sessions" },
  { id: "t2", label: "My mentee created a seamless communication channel with me" },
  { id: "t3", label: "My mentee makes use of feedback provided during mentorship relationship" },
  {
    id: "t4",
    label: "My mentee has exhibited tremendous personal and professional growth rate over time",
  },
  {
    id: "t5",
    label: "My mentee demonstrated a reasonable interest towards me in my quest to offer assistance",
  },
  { id: "t6", label: "My mentee has improved immensely in their communication skills" },
  { id: "t7", label: "My mentee carried out all their assigned tasks in team projects" },
  {
    id: "t8",
    label:
      "The level of growth of my mentee's technical and professional knowledge will help them get a job fast",
  },
  {
    id: "t9",
    label: "I would love to advance the mentoring relationship with my mentee after TIIDELab",
  },
  { id: "t10", label: "I recommend my mentee for further personal and professional development" },
  { id: "t11", label: "I recommend inclusion of mentorship sessions for future TIIDELab Programs" },
];

/* ==========================================================================
 * 4. CALL LOG
 * ========================================================================== */

export const CALL_MODES = [
  "Phone call",
  "Conference Call",
  "In person",
  "Chat / WhatsApp",
  "Email",
] as const;

export type CallMode = (typeof CALL_MODES)[number];

export const isCallMode = (value: string): value is CallMode =>
  (CALL_MODES as readonly string[]).includes(value);

/* ==========================================================================
 * HELPERS
 * ========================================================================== */

/** Answers keyed by question id, with the label attached for emails/exports. */
export type AnswerMap = Record<string, string>;

export interface LabelledAnswer {
  id: string;
  label: string;
  answer: string;
}

export function withLabels(
  questions: OpenQuestion[] | LikertStatement[],
  answers: Record<string, string | number | null | undefined>,
): LabelledAnswer[] {
  return questions.map((question) => ({
    id: question.id,
    label: question.label,
    answer: String(answers[question.id] ?? "").trim(),
  }));
}
