import { HOST_COMPANY, PROGRAM } from "@/mentorship/data/program";
import { likertLabel, type LabelledAnswer } from "@/mentorship/data/forms";
import { formatLongDate } from "@/mentorship/lib/utils";

/* ============================================================================
 * EMAIL TEMPLATES
 * ============================================================================
 * Every form in the app sends mail through the same renderer: a form declares
 * a title, an accent colour and a list of blocks, and gets a matching HTML
 * and plain-text body out. Adding a form means adding a block list, not a new
 * pile of table markup.
 * ==========================================================================*/

export const BRAND = "#f9601a";
export const TEAL = "#0b8d87";
export const INDIGO = "#486393";

const INK = "#131c30";
const MUTED = "#5b6880";
const BORDER = "#e4e8f0";
const SURFACE = "#f8fafc";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Preserves the line breaks a person typed into a textarea. */
function paragraphs(value: string) {
  return escapeHtml(value.trim()).replace(/\r?\n/g, "<br />");
}

/* ==========================================================================
 * BLOCKS
 * ========================================================================== */

export interface ResourceLink {
  name: string;
  url: string;
}

export interface LikertAnswer {
  label: string;
  value: number | null;
}

export interface AnswerCard {
  title: string;
  subtitle?: string;
  /** Free-text question/answer pairs. */
  answers?: LabelledAnswer[];
  /** Likert rows, when the card is a rating sheet. */
  ratings?: LikertAnswer[];
  average?: number | null;
  /** A closing free-text note on the card. */
  note?: { label: string; text: string };
}

export type Block =
  | { type: "note"; text: string }
  | { type: "meta"; rows: Array<[string, string]> }
  | { type: "answers"; heading: string; items: LabelledAnswer[] }
  | { type: "text"; heading: string; body: string }
  | { type: "likert"; heading: string; items: LikertAnswer[]; average: number | null }
  | { type: "cards"; heading: string; cards: AnswerCard[] }
  | { type: "resources"; resources: ResourceLink[] }
  | { type: "attachments"; names: string[] };

/* ==========================================================================
 * HTML RENDERING
 * ========================================================================== */

function sectionHeading(text: string, accent: string) {
  return `<div style="font-size:12px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;color:${accent};margin:26px 0 12px;padding-bottom:8px;border-bottom:1px solid ${BORDER};">${escapeHtml(text)}</div>`;
}

function metaTableHtml(rows: Array<[string, string]>) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    ${rows
      .filter(([, value]) => value)
      .map(
        ([label, value]) => `<tr>
          <td style="padding:7px 0;font-size:12px;color:${MUTED};width:160px;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:7px 0;font-size:14px;font-weight:600;color:${INK};">${escapeHtml(value)}</td>
        </tr>`,
      )
      .join("")}
  </table>`;
}

function answersHtml(items: LabelledAnswer[], accent: string) {
  return items
    .map(
      (item) => `<div style="margin-bottom:16px;">
        <div style="font-size:12px;font-weight:700;color:${accent};margin-bottom:5px;">${escapeHtml(item.label)}</div>
        <div style="font-size:14px;line-height:1.7;color:#26324a;background:${SURFACE};border:1px solid ${BORDER};border-radius:8px;padding:12px 14px;">${
          item.answer ? paragraphs(item.answer) : `<span style="color:${MUTED};">Not answered</span>`
        }</div>
      </div>`,
    )
    .join("");
}

function likertHtml(items: LikertAnswer[], average: number | null, accent: string) {
  const rows = items
    .map(
      (item, index) => `<tr>
        <td style="padding:9px 10px;font-size:12px;color:${MUTED};border-bottom:1px solid ${BORDER};width:26px;vertical-align:top;">${index + 1}.</td>
        <td style="padding:9px 10px;font-size:13px;line-height:1.6;color:${INK};border-bottom:1px solid ${BORDER};">${escapeHtml(item.label)}</td>
        <td style="padding:9px 10px;font-size:13px;font-weight:700;color:${accent};border-bottom:1px solid ${BORDER};white-space:nowrap;text-align:right;vertical-align:top;">
          ${item.value ? `${item.value} &middot; ${escapeHtml(likertLabel(item.value))}` : `<span style="color:${MUTED};font-weight:400;">—</span>`}
        </td>
      </tr>`,
    )
    .join("");

  const footer =
    average === null
      ? ""
      : `<div style="margin-top:12px;font-size:13px;color:${INK};">Average score: <strong style="color:${accent};">${average.toFixed(2)} / 5</strong></div>`;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid ${BORDER};border-radius:8px;">${rows}</table>${footer}`;
}

function cardHtml(card: AnswerCard, accent: string) {
  const inner = [
    `<div style="font-size:15px;font-weight:700;color:${INK};">${escapeHtml(card.title)}</div>`,
    card.subtitle
      ? `<div style="font-size:12px;color:${MUTED};margin-top:2px;">${escapeHtml(card.subtitle)}</div>`
      : "",
    card.answers?.length ? `<div style="margin-top:12px;">${answersHtml(card.answers, accent)}</div>` : "",
    card.ratings?.length
      ? `<div style="margin-top:12px;">${likertHtml(card.ratings, card.average ?? null, accent)}</div>`
      : "",
    card.note?.text
      ? `<div style="margin-top:12px;">
           <div style="font-size:12px;font-weight:700;color:${accent};margin-bottom:5px;">${escapeHtml(card.note.label)}</div>
           <div style="font-size:14px;line-height:1.7;color:#26324a;">${paragraphs(card.note.text)}</div>
         </div>`
      : "",
  ].join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;border:1px solid ${BORDER};border-radius:10px;border-left:3px solid ${accent};">
    <tr><td style="padding:16px 18px;">${inner}</td></tr>
  </table>`;
}

function resourcesHtml(resources: ResourceLink[], accent: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    ${resources
      .map(
        (resource) => `<tr>
          <td style="padding:9px 0;border-bottom:1px solid ${BORDER};font-size:14px;color:${INK};">${escapeHtml(resource.name)}</td>
          <td style="padding:9px 0;border-bottom:1px solid ${BORDER};text-align:right;white-space:nowrap;">
            <a href="${escapeHtml(resource.url)}" style="font-size:13px;font-weight:700;color:${accent};text-decoration:none;">Open &rarr;</a>
          </td>
        </tr>`,
      )
      .join("")}
  </table>
  <p style="font-size:12px;color:${MUTED};margin-top:10px;">Hosted on Cloudinary — the links stay live for the duration of the programme.</p>`;
}

function blockHtml(block: Block, accent: string): string {
  switch (block.type) {
    case "note":
      return `<p style="font-size:14px;line-height:1.7;color:${MUTED};margin:0 0 20px;">${paragraphs(block.text)}</p>`;
    case "meta":
      return metaTableHtml(block.rows);
    case "answers":
      return block.items.length === 0
        ? ""
        : sectionHeading(block.heading, accent) + answersHtml(block.items, accent);
    case "text":
      return !block.body.trim()
        ? ""
        : sectionHeading(block.heading, accent) +
            `<div style="font-size:14px;line-height:1.75;color:#26324a;background:${SURFACE};border:1px solid ${BORDER};border-radius:10px;padding:16px;">${paragraphs(block.body)}</div>`;
    case "likert":
      return (
        sectionHeading(block.heading, accent) + likertHtml(block.items, block.average, accent)
      );
    case "cards":
      return block.cards.length === 0
        ? ""
        : sectionHeading(block.heading, accent) +
            block.cards.map((card) => cardHtml(card, accent)).join("");
    case "resources":
      return block.resources.length === 0
        ? ""
        : sectionHeading(`Shared resources (${block.resources.length})`, accent) +
            resourcesHtml(block.resources, accent);
    case "attachments":
      return block.names.length === 0
        ? ""
        : sectionHeading(`Attached files (${block.names.length})`, accent) +
            `<ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.9;color:${INK};">${block.names
              .map((name) => `<li>${escapeHtml(name)}</li>`)
              .join("")}</ul>
             <p style="font-size:12px;color:${MUTED};margin-top:10px;">These files are attached to this email.</p>`;
  }
}

/** Wraps rendered blocks in the branded shell every message shares. */
export function renderHtml(title: string, accent: string, blocks: Block[]) {
  const body = blocks.map((block) => blockHtml(block, accent)).join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px 12px;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${INK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:660px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ${BORDER};">
      <tr>
        <td style="background:${INK};padding:24px 28px;">
          <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${accent};font-weight:700;">
            ${escapeHtml(PROGRAM.name)}
          </div>
          <div style="font-size:21px;font-weight:700;color:#ffffff;margin-top:6px;">${escapeHtml(title)}</div>
          <div style="font-size:12px;color:#9dadcc;margin-top:8px;">
            Sponsored by ${escapeHtml(PROGRAM.sponsor)} &nbsp;&bull;&nbsp; Facilitated by ${escapeHtml(HOST_COMPANY.name)}
          </div>
        </td>
      </tr>
      <tr><td style="height:4px;background:${accent};"></td></tr>
      <tr><td style="padding:28px;">${body}</td></tr>
      <tr>
        <td style="padding:18px 28px;background:${SURFACE};border-top:1px solid ${BORDER};font-size:11px;color:${MUTED};">
          Sent automatically from the Mentorship Feedback Channel &nbsp;&bull;&nbsp; ${escapeHtml(HOST_COMPANY.email)}
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/* ==========================================================================
 * PLAIN TEXT RENDERING
 * ========================================================================== */

function blockText(block: Block): string[] {
  switch (block.type) {
    case "note":
      return [block.text, ""];
    case "meta":
      return [...block.rows.filter(([, v]) => v).map(([label, value]) => `${label}: ${value}`), ""];
    case "answers":
      if (block.items.length === 0) return [];
      return [
        block.heading.toUpperCase(),
        ...block.items.flatMap((item) => [
          "",
          `${item.label}`,
          `  ${(item.answer || "Not answered").replace(/\r?\n/g, "\n  ")}`,
        ]),
        "",
      ];
    case "text":
      return block.body.trim() ? [block.heading.toUpperCase(), block.body.trim(), ""] : [];
    case "likert":
      return [
        block.heading.toUpperCase(),
        ...block.items.map(
          (item, index) =>
            `${index + 1}. ${item.label}\n   ${item.value ? `${item.value} - ${likertLabel(item.value)}` : "Not answered"}`,
        ),
        ...(block.average === null ? [] : [`Average score: ${block.average.toFixed(2)} / 5`]),
        "",
      ];
    case "cards":
      if (block.cards.length === 0) return [];
      return [
        block.heading.toUpperCase(),
        ...block.cards.flatMap((card) => [
          "",
          `--- ${card.title}${card.subtitle ? ` (${card.subtitle})` : ""} ---`,
          ...(card.answers ?? []).flatMap((item) => [
            `${item.label}`,
            `  ${(item.answer || "Not answered").replace(/\r?\n/g, "\n  ")}`,
          ]),
          ...(card.ratings ?? []).map(
            (item, index) =>
              `${index + 1}. ${item.label}: ${item.value ? `${item.value} - ${likertLabel(item.value)}` : "Not answered"}`,
          ),
          ...(card.average === null || card.average === undefined
            ? []
            : [`Average score: ${card.average.toFixed(2)} / 5`]),
          ...(card.note?.text ? [`${card.note.label}: ${card.note.text}`] : []),
        ]),
        "",
      ];
    case "resources":
      if (block.resources.length === 0) return [];
      return [
        `SHARED RESOURCES (${block.resources.length})`,
        ...block.resources.map((resource) => `- ${resource.name}: ${resource.url}`),
        "",
      ];
    case "attachments":
      if (block.names.length === 0) return [];
      return [`ATTACHED FILES (${block.names.length})`, ...block.names.map((n) => `- ${n}`), ""];
  }
}

export function renderText(title: string, blocks: Block[]) {
  return [
    title.toUpperCase(),
    `Programme: ${PROGRAM.name} (sponsored by ${PROGRAM.sponsor})`,
    `Facilitated by: ${HOST_COMPANY.name}`,
    "",
    ...blocks.flatMap(blockText),
  ].join("\n");
}

/* ==========================================================================
 * A COMPOSED MESSAGE — what every builder below returns
 * ========================================================================== */

export interface ComposedEmail {
  subject: string;
  html: string;
  text: string;
}

function compose(subject: string, title: string, accent: string, blocks: Block[]): ComposedEmail {
  return {
    subject,
    html: renderHtml(title, accent, blocks),
    text: renderText(title, blocks),
  };
}

const today = () => formatLongDate(new Date().toISOString().slice(0, 10));

/** Trailing blocks shared by every form: resource links, then attachments. */
function fileBlocks(resources: ResourceLink[], attachmentNames: string[]): Block[] {
  return [
    { type: "resources", resources },
    { type: "attachments", names: attachmentNames },
  ];
}

/* ==========================================================================
 * 1. MENTEE MESSAGE  ->  their mentor (+ organiser)
 * ========================================================================== */

export interface MenteeMessageEmail {
  studentName: string;
  studentEmail: string;
  groupLabel: string;
  mentorName: string;
  message: string;
  resources: ResourceLink[];
  attachmentNames: string[];
}

export function menteeMessageEmail(data: MenteeMessageEmail): ComposedEmail {
  return compose(
    `Message from ${data.studentName} (${data.groupLabel}) — ${PROGRAM.name}`,
    "A Message From Your Mentee",
    TEAL,
    [
      {
        type: "note",
        text: `Hello ${data.mentorName}, one of your mentees has sent you a message. A copy has also gone to ${HOST_COMPANY.name} for the record.`,
      },
      {
        type: "meta",
        rows: [
          ["From", data.studentName],
          ["Email", data.studentEmail || "No email on file"],
          ["Group", data.groupLabel],
          ["Mentor", data.mentorName],
          ["Sent", today()],
        ],
      },
      { type: "text", heading: "Their message", body: data.message },
      ...fileBlocks(data.resources, data.attachmentNames),
      ...(data.studentEmail
        ? [
            {
              type: "note" as const,
              text: `Reply to this email to respond directly to ${data.studentName}.`,
            },
          ]
        : []),
    ],
  );
}

/* ==========================================================================
 * 2. MENTOR MONTHLY REPORT  ->  organiser only
 * ========================================================================== */

export interface MentorReportEmail {
  mentorName: string;
  groupLabel: string;
  monthLabel: string;
  sessionDate: string;
  menteeFeedback: Array<{ name: string; email: string; answers: LabelledAnswer[] }>;
  generalComment: string;
  resources: ResourceLink[];
  attachmentNames: string[];
}

export function mentorReportEmail(data: MentorReportEmail): ComposedEmail {
  return compose(
    `Mentor Report — ${data.mentorName} (${data.groupLabel}) — ${data.monthLabel}`,
    "Monthly Mentor Report",
    BRAND,
    [
      {
        type: "meta",
        rows: [
          ["Mentor", data.mentorName],
          ["Group", data.groupLabel],
          ["Reporting month", data.monthLabel],
          ["Session date", formatLongDate(data.sessionDate)],
          ["Mentees covered", String(data.menteeFeedback.length)],
        ],
      },
      {
        type: "cards",
        heading: `Per-mentee evaluation (${data.menteeFeedback.length})`,
        cards: data.menteeFeedback.map((mentee) => ({
          title: mentee.name,
          subtitle: mentee.email || "no email on file",
          answers: mentee.answers,
        })),
      },
      { type: "text", heading: "General comment on the session", body: data.generalComment },
      ...fileBlocks(data.resources, data.attachmentNames),
    ],
  );
}

/* ==========================================================================
 * 3. INTAKE — mentee and mentor, once each at the start
 * ========================================================================== */

export interface MenteeIntakeEmail {
  studentName: string;
  studentEmail: string;
  gender: string;
  groupLabel: string;
  mentorName: string;
  answers: LabelledAnswer[];
}

export function menteeIntakeEmail(data: MenteeIntakeEmail): ComposedEmail {
  return compose(
    `Mentee Intake — ${data.studentName} (${data.groupLabel}) — ${PROGRAM.name}`,
    "Mentee's Interest & Expectations",
    TEAL,
    [
      {
        type: "note",
        text: `${data.studentName} has completed the pre-mentorship intake form. This is submitted once, before the mentorship begins.`,
      },
      {
        type: "meta",
        rows: [
          ["Mentee", data.studentName],
          ["Email", data.studentEmail || "No email on file"],
          ["Gender", data.gender || "Not stated"],
          ["Group", data.groupLabel],
          ["Assigned mentor", data.mentorName || "Not yet assigned"],
          ["Submitted", today()],
        ],
      },
      { type: "answers", heading: "Interest and expectations", items: data.answers },
    ],
  );
}

export interface MentorIntakeEmail {
  mentorName: string;
  mentorEmail: string;
  mentorPhone: string;
  groupLabel: string;
  menteeCount: number;
  answers: LabelledAnswer[];
}

export function mentorIntakeEmail(data: MentorIntakeEmail): ComposedEmail {
  return compose(
    `Mentor Intake — ${data.mentorName} (${data.groupLabel}) — ${PROGRAM.name}`,
    "Mentor's Interest, Expectations & Info",
    BRAND,
    [
      {
        type: "note",
        text: `${data.mentorName} has completed the pre-mentorship intake form. This is submitted once, before the mentorship begins.`,
      },
      {
        type: "meta",
        rows: [
          ["Mentor", data.mentorName],
          ["Email", data.mentorEmail || "No email on file"],
          ["Phone", data.mentorPhone || "Not provided"],
          ["Group", data.groupLabel],
          ["Mentees assigned", String(data.menteeCount)],
          ["Submitted", today()],
        ],
      },
      { type: "answers", heading: "Interest, expectations and other info", items: data.answers },
    ],
  );
}

/* ==========================================================================
 * 4. CALL LOG
 * ========================================================================== */

export interface CallLogEmail {
  loggedBy: "mentor" | "mentee";
  loggerName: string;
  mentorName: string;
  /** One call can cover several mentees at once — a group session counts once. */
  menteeNames: string[];
  callDate: string;
  mode: string;
  note: string;
}

export function callLogEmail(data: CallLogEmail): ComposedEmail {
  const mentees = data.menteeNames.filter(Boolean);
  const menteeSummary = mentees.length === 0 ? "" : listOf(mentees);
  const subjectParty =
    mentees.length > 1 ? `${mentees.length} mentees` : (mentees[0] ?? "their mentee");

  return compose(
    `Call logged — ${data.mentorName} & ${subjectParty} — ${formatLongDate(data.callDate)}`,
    "Mentorship Call Log",
    INDIGO,
    [
      {
        type: "note",
        text: `${data.loggerName} logged a mentorship call. These entries feed the final evaluation sheets at the end of the programme.`,
      },
      {
        type: "meta",
        rows: [
          ["Logged by", `${data.loggerName} (${data.loggedBy})`],
          ["Mentor", data.mentorName],
          [mentees.length > 1 ? `Mentees (${mentees.length})` : "Mentee", menteeSummary],
          ["Date of call", formatLongDate(data.callDate)],
          ["Mode", data.mode],
        ],
      },
      { type: "text", heading: "Note", body: data.note },
    ],
  );
}

/** ["A", "B", "C"] -> "A, B and C" */
const listOf = (names: string[]) =>
  names.length < 2 ? (names[0] ?? "") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;

/* ==========================================================================
 * 5. FINAL EVALUATION SHEETS
 * ========================================================================== */

export interface MenteeFinalEmail {
  studentName: string;
  studentEmail: string;
  mentorName: string;
  location: string;
  track: string;
  ratings: LikertAnswer[];
  average: number | null;
  comments: string;
}

export function menteeFinalEmail(data: MenteeFinalEmail): ComposedEmail {
  return compose(
    `Mentee Final Evaluation — ${data.studentName} on ${data.mentorName} — ${PROGRAM.name}`,
    "Mentee's Final Evaluation Sheet",
    TEAL,
    [
      {
        type: "meta",
        rows: [
          ["Mentor's name", data.mentorName],
          ["Mentee's name", data.studentName],
          ["Mentee's email", data.studentEmail || "No email on file"],
          ["Location", data.location || "Not stated"],
          ["Track", data.track || "Not stated"],
          ["Submitted", today()],
        ],
      },
      {
        type: "likert",
        heading: "Ratings (1 Strongly Disagree — 5 Strongly Agree)",
        items: data.ratings,
        average: data.average,
      },
      { type: "text", heading: "Other comments", body: data.comments },
    ],
  );
}

export interface MentorFinalEmail {
  mentorName: string;
  location: string;
  track: string;
  sheets: Array<{
    menteeName: string;
    menteeEmail: string;
    ratings: LikertAnswer[];
    average: number | null;
    recommendations: string;
  }>;
  overallAverage: number | null;
}

export function mentorFinalEmail(data: MentorFinalEmail): ComposedEmail {
  return compose(
    `Mentor Final Evaluation — ${data.mentorName} (${data.sheets.length} mentees) — ${PROGRAM.name}`,
    "Mentor's Final Evaluation Sheet",
    BRAND,
    [
      {
        type: "meta",
        rows: [
          ["Mentor's name", data.mentorName],
          ["Mentees evaluated", String(data.sheets.length)],
          ["Location", data.location || "Not stated"],
          ["Track", data.track || "Not stated"],
          [
            "Overall average",
            data.overallAverage === null ? "" : `${data.overallAverage.toFixed(2)} / 5`,
          ],
          ["Submitted", today()],
        ],
      },
      {
        type: "cards",
        heading: `Per-mentee rating sheets (${data.sheets.length})`,
        cards: data.sheets.map((sheet) => ({
          title: sheet.menteeName,
          subtitle: sheet.menteeEmail || "no email on file",
          ratings: sheet.ratings,
          average: sheet.average,
          note: sheet.recommendations
            ? { label: "Other recommendations", text: sheet.recommendations }
            : undefined,
        })),
      },
    ],
  );
}

/* ==========================================================================
 * 6. ACKNOWLEDGEMENT — the copy that goes back to whoever submitted
 * ========================================================================== */

export function acknowledgementEmail(
  recipientName: string,
  whatTheySubmitted: string,
  accent: string,
  summary: Array<[string, string]>,
): ComposedEmail {
  return compose(
    `We received your ${whatTheySubmitted} — ${PROGRAM.name}`,
    "Submission Received",
    accent,
    [
      {
        type: "note",
        text: `Thank you, ${recipientName}. Your ${whatTheySubmitted} has been received by ${HOST_COMPANY.name} and recorded against the programme. No further action is needed — this message is just your copy.`,
      },
      { type: "meta", rows: [...summary, ["Received", today()]] },
      {
        type: "note",
        text: `If anything above looks wrong, reply to this email and ${HOST_COMPANY.name} will sort it out.`,
      },
    ],
  );
}

/** Mean of the answered ratings, or null when nothing was answered. */
export function averageOf(values: Array<number | null>): number | null {
  const answered = values.filter((value): value is number => typeof value === "number");
  if (answered.length === 0) return null;
  return answered.reduce((sum, value) => sum + value, 0) / answered.length;
}
