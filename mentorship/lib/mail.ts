import nodemailer, { type Transporter } from "nodemailer";

import { HOST_COMPANY, PROGRAM } from "@/mentorship/data/program";
import type { ComposedEmail } from "@/mentorship/lib/email-templates";

/**
 * SMTP transport (Gmail by default).
 *
 * Set these in .env.local (see env.example):
 *   SMTP_USER  - the address that sends the mail
 *   SMTP_PASS  - a Google *App Password*, not the normal account password
 */
/**
 * Env values arrive from .env files, dashboards and copy-paste, so they can
 * carry stray whitespace, wrapping quotes or a trailing carriage return. Gmail
 * rejects a password that differs by a single character, which surfaces as an
 * opaque 502 on the form, so every value is cleaned before it is used.
 */
function env(name: string): string {
  return (process.env[name] ?? "").trim().replace(/^["']|["']$/g, "");
}

const SMTP_HOST = env("SMTP_HOST") || "smtp.gmail.com";
const SMTP_PORT = Number(env("SMTP_PORT") || 465);
const SMTP_USER = env("SMTP_USER");
/**
 * Google displays app passwords as four groups of four ("abcd efgh ijkl mnop")
 * and the spaces are presentation only - SMTP wants the bare 16 characters.
 */
const SMTP_PASS = env("SMTP_PASS").replace(/\s+/g, "");

export const MAIL_FROM_NAME = env("MAIL_FROM_NAME") || PROGRAM.name;

/**
 * Optional HTTP delivery (Brevo).
 *
 * Several hosting platforms block outbound SMTP entirely, which shows up as a
 * connection timeout to smtp.gmail.com no matter which port is tried. When
 * BREVO_API_KEY is present we deliver over HTTPS instead, which nothing
 * blocks, and fall back to SMTP if that call fails.
 *
 * Brevo authenticates a single *sender address* rather than a whole domain, so
 * MAIL_FROM_ADDRESS only has to be confirmed once by clicking the link Brevo
 * emails to it - a Gmail address is fine. That is the difference that matters
 * here: sending from a Gmail address is something a domain-based provider can
 * never be made to do.
 */
const BREVO_API_KEY = env("BREVO_API_KEY");
const MAIL_FROM_ADDRESS = env("MAIL_FROM_ADDRESS") || SMTP_USER;

/**
 * Raised once every configured route has been tried, carrying one reason per
 * provider so the form can show why the *first choice* failed rather than the
 * fallback's unrelated complaint.
 */
export class DeliveryError extends Error {
  constructor(readonly reasons: string[]) {
    super(reasons.join(" "));
    this.name = "DeliveryError";
  }
}

/** Where every submission is reported. Overridable for testing. */
export const FEEDBACK_INBOX = env("FEEDBACK_INBOX") || HOST_COMPANY.email;

export function isMailConfigured() {
  if (BREVO_API_KEY && MAIL_FROM_ADDRESS) return true;
  return Boolean(SMTP_USER && SMTP_PASS);
}

/** What the transport is pointed at, for the admin health strip. */
export const mailSettings = () => ({
  host: SMTP_HOST,
  port: SMTP_PORT,
  user: SMTP_USER,
  transport: BREVO_API_KEY ? ("brevo" as const) : ("smtp" as const),
  from: MAIL_FROM_ADDRESS,
  configured: isMailConfigured(),
});

/**
 * Opens a connection and authenticates without sending anything. Used by the
 * admin health check so a bad app password is visible before someone fills in
 * a whole form and hits a failed send.
 */
export async function verifyMail(): Promise<{ ok: boolean; reason?: string }> {
  if (!isMailConfigured()) {
    return { ok: false, reason: "SMTP_USER and SMTP_PASS are not set." };
  }
  if (BREVO_API_KEY) {
    // Brevo has no "open a connection" step, so the health check is two
    // questions: is the key good, and is the sender address confirmed? The
    // second is the one that silently breaks every send, so it is worth
    // asking here rather than discovering it on someone's submission.
    const headers = { "api-key": BREVO_API_KEY, Accept: "application/json" };
    try {
      const account = await fetch("https://api.brevo.com/v3/account", {
        headers,
        signal: AbortSignal.timeout(10_000),
      });
      if (!account.ok) {
        const body = await account.text().catch(() => "");
        return {
          ok: false,
          reason: `Brevo rejected the API key (HTTP ${account.status}). ${body}`.trim(),
        };
      }

      const senders = await fetch("https://api.brevo.com/v3/senders", {
        headers,
        signal: AbortSignal.timeout(10_000),
      });
      // A key without permission to list senders is still a working key, so a
      // failure here is not treated as a failed health check.
      if (senders.ok) {
        const { senders: list = [] } = (await senders.json()) as {
          senders?: Array<{ email?: string; active?: boolean }>;
        };
        const match = list.find(
          (sender) => sender.email?.toLowerCase() === MAIL_FROM_ADDRESS.toLowerCase(),
        );
        if (!match) {
          return {
            ok: false,
            reason:
              `${MAIL_FROM_ADDRESS} is not one of this Brevo account's senders, so every send ` +
              "will be refused. Add it at https://app.brevo.com/senders and click the " +
              "confirmation link Brevo emails to it.",
          };
        }
        if (match.active === false) {
          return {
            ok: false,
            reason:
              `${MAIL_FROM_ADDRESS} is registered with Brevo but not yet confirmed. Open the ` +
              "confirmation email Brevo sent to that address and click the link.",
          };
        }
      }

      return { ok: true };
    } catch (error) {
      return { ok: false, reason: describeMailError(error) };
    }
  }

  if (!(SMTP_USER && SMTP_PASS)) {
    return { ok: false, reason: "No SMTP credentials are set." };
  }

  let lastError: unknown;
  for (const route of smtpRoutes()) {
    try {
      await transportFor(route).verify();
      working = routeKey(route);
      return { ok: true };
    } catch (error) {
      lastError = error;
      if (!isTransient(error)) break;
    }
  }
  return { ok: false, reason: describeMailError(lastError) };
}

/**
 * Turns a nodemailer failure into something an organiser can act on. The
 * distinction that matters most is "the credentials are wrong" (which only a
 * person can fix) versus "the network did not cooperate" (worth retrying).
 */
export function describeMailError(error: unknown): string {
  // Only the first route's reason is shown. Every route is logged, but the
  // preferred provider's complaint is the one that has to be fixed - stacking
  // the fallback's unrelated error on top of it only buries the fix.
  if (error instanceof DeliveryError) {
    return error.reasons[0] ?? "The mail server refused the message.";
  }

  const err = error as { code?: string; responseCode?: number; message?: string } | undefined;
  const code = err?.code ?? "";
  const responseCode = err?.responseCode ?? 0;

  if (code === "EAUTH" || responseCode === 535 || responseCode === 534) {
    return (
      `The mail account ${SMTP_USER || "(unset)"} rejected our login. ` +
      "SMTP_PASS must be a current 16-character Google App Password for that exact " +
      "account, generated at https://myaccount.google.com/apppasswords with 2-Step " +
      "Verification switched on. Generate a fresh one and redeploy."
    );
  }
  if (isTransient(error)) {
    const advice = BREVO_API_KEY
      ? "Brevo is configured but also failed - its reason is the one to act on."
      : "Hosting platforms often block outbound SMTP entirely: set BREVO_API_KEY and " +
        "MAIL_FROM_ADDRESS to deliver over HTTPS instead.";
    return `Could not reach ${SMTP_HOST} on port ${SMTP_PORT} or the fallback port. ${advice}`;
  }
  return err?.message || "The mail server refused the message.";
}

/* --------------------------------------------------------------------------
 * SMTP ROUTES
 * --------------------------------------------------------------------------
 * A blocked port looks exactly like a dead server, so rather than give up on
 * the one port that was configured we try the other standard one too: 587
 * (STARTTLS) and 465 (implicit TLS). Whichever answers is remembered for the
 * life of the process.
 * ------------------------------------------------------------------------*/

interface SmtpRoute {
  port: number;
  secure: boolean;
}

const routeKey = (route: SmtpRoute) => `${SMTP_HOST}:${route.port}`;

function smtpRoutes(): SmtpRoute[] {
  // The configured port first, then both standard submission ports, so an
  // unusual or blocked setting still has somewhere to go.
  const candidates: SmtpRoute[] = [
    { port: SMTP_PORT, secure: SMTP_PORT === 465 },
    { port: 587, secure: false },
    { port: 465, secure: true },
  ];

  const routes: SmtpRoute[] = [];
  for (const route of candidates) {
    if (!routes.some((seen) => seen.port === route.port)) routes.push(route);
  }

  // Once a route has worked, start there instead of paying the timeout again.
  if (!working) return routes;
  return [...routes].sort(
    (a, b) => Number(routeKey(b) === working) - Number(routeKey(a) === working),
  );
}

/** Errors worth retrying on another port. An auth failure is not one. */
const TRANSIENT_CODES = new Set([
  "ETIMEDOUT",
  "ECONNECTION",
  "ESOCKET",
  "ECONNREFUSED",
  "ECONNRESET",
  "EPIPE",
  "EDNS",
  "EAI_AGAIN",
  "ETIMEDOUT_CONN",
]);

function isTransient(error: unknown): boolean {
  const err = error as { code?: string; responseCode?: number } | undefined;
  if (err?.code && TRANSIENT_CODES.has(err.code)) return true;
  // 4xx SMTP replies are "try again later" by definition.
  return typeof err?.responseCode === "number" && err.responseCode >= 400 && err.responseCode < 500;
}

/** The route that last delivered, so later sends skip the dead one. */
let working: string | null = null;

const transports = new Map<string, Transporter>();

function transportFor(route: SmtpRoute): Transporter {
  const key = routeKey(route);
  let transport = transports.get(key);
  if (!transport) {
    transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: route.port,
      secure: route.secure,
      // 587 must not be left as plaintext if the server declines STARTTLS.
      requireTLS: !route.secure,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      // A hung TCP connect on a serverless host is what turns a slow send into
      // a gateway timeout. Fail fast instead, so the form can say why.
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 30_000,
    });
    transports.set(key, transport);
  }
  return transport;
}

export interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export interface SendMailInput {
  to: string | string[];
  cc?: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  attachments?: MailAttachment[];
}

const list = (value: string | string[] | undefined): string[] =>
  (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean);

/** Delivery over Brevo's HTTPS API, for hosts that block outbound SMTP. */
async function sendViaBrevo(input: SendMailInput) {
  const recipients = (value: string | string[] | undefined) =>
    list(value).map((email) => ({ email }));

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: MAIL_FROM_NAME, email: MAIL_FROM_ADDRESS },
      to: recipients(input.to),
      cc: list(input.cc).length > 0 ? recipients(input.cc) : undefined,
      replyTo: input.replyTo ? { email: input.replyTo } : undefined,
      subject: input.subject,
      textContent: input.text,
      htmlContent: input.html,
      // Brevo takes base64 under `content`, and names the file with `name`.
      attachment: input.attachments?.map((attachment) => ({
        name: attachment.filename,
        content: attachment.content.toString("base64"),
      })),
    }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new BrevoError(response.status, detail);
  }
  return response.json();
}

/** A non-2xx from Brevo, keeping the status and body for translation. */
class BrevoError extends Error {
  constructor(
    readonly status: number,
    readonly body: string,
  ) {
    super(`Brevo refused the message (HTTP ${status}). ${body}`.trim());
    this.name = "BrevoError";
  }
}

/**
 * Turns Brevo's JSON error into an instruction.
 *
 * The one that will actually happen is an unverified sender: Brevo accepts the
 * key, then refuses the send because MAIL_FROM_ADDRESS has not had its
 * confirmation link clicked. That is not something a retry fixes, so the
 * message says which page to open.
 */
function describeBrevoError(error: unknown): string {
  if (!(error instanceof BrevoError)) {
    const err = error as { name?: string; message?: string } | undefined;
    if (err?.name === "TimeoutError" || err?.name === "AbortError") {
      return "Brevo did not respond in time.";
    }
    return `Brevo could not be reached. ${err?.message ?? ""}`.trim();
  }

  let message = error.body;
  let code = "";
  try {
    const parsed = JSON.parse(error.body) as { message?: string; code?: string };
    message = parsed.message || error.body;
    code = parsed.code ?? "";
  } catch {
    /* Not JSON - use the raw body. */
  }

  const lower = `${code} ${message}`.toLowerCase();

  if (lower.includes("sender") && (lower.includes("not valid") || lower.includes("not exist"))) {
    return (
      `Brevo will not send from ${MAIL_FROM_ADDRESS} until that address is verified: ${message} ` +
      "Add it under Senders at https://app.brevo.com/senders and click the confirmation link " +
      "Brevo emails to it."
    );
  }
  if (error.status === 401) {
    return `Brevo rejected the API key: ${message}`;
  }
  if (error.status === 402) {
    return "The Brevo account is out of sending credits.";
  }
  if (error.status === 429) {
    return "Brevo is rate limiting this account. Wait a moment and try again.";
  }
  return `Brevo refused the message (HTTP ${error.status}). ${message}`;
}

/** Delivery over SMTP, trying the fallback port when the first is unreachable. */
async function sendViaSmtp(input: SendMailInput) {
  const message = {
    from: `"${MAIL_FROM_NAME}" <${SMTP_USER}>`,
    to: list(input.to).join(", "),
    cc: list(input.cc).join(", ") || undefined,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
    html: input.html,
    attachments: input.attachments,
  };

  let lastError: unknown;
  for (const route of smtpRoutes()) {
    try {
      const info = await transportFor(route).sendMail(message);
      working = routeKey(route);
      return info;
    } catch (error) {
      lastError = error;
      // A rejected password will be rejected on every port; only a connection
      // problem is worth another attempt.
      if (!isTransient(error)) throw error;
      console.error(`[mail] ${routeKey(route)} unreachable, trying the next route:`, error);
    }
  }
  throw lastError;
}

export async function sendMail(input: SendMailInput) {
  if (!isMailConfigured()) {
    throw new Error(
      "Email is not configured. Add SMTP_USER and SMTP_PASS to .env.local (see env.example).",
    );
  }

  const reasons: string[] = [];

  if (BREVO_API_KEY && MAIL_FROM_ADDRESS) {
    try {
      return await sendViaBrevo(input);
    } catch (error) {
      console.error("[mail] Brevo delivery failed:", error);
      reasons.push(describeBrevoError(error));
      // Keep SMTP as a second chance when it is also configured.
      if (!(SMTP_USER && SMTP_PASS)) throw new DeliveryError(reasons);
    }
  }

  try {
    return await sendViaSmtp(input);
  } catch (error) {
    console.error("[mail] SMTP delivery failed:", error);
    reasons.push(describeMailError(error));
    throw new DeliveryError(reasons);
  }
}

/** Sends an email already built by one of the template builders. */
export async function sendComposed(
  email: ComposedEmail,
  routing: {
    to: string | string[];
    cc?: string | string[];
    replyTo?: string;
    attachments?: MailAttachment[];
  },
) {
  return sendMail({ ...routing, ...email });
}

/**
 * Attempts a delivery and reports the outcome instead of throwing.
 *
 * Submissions are recorded before they are emailed, so a mail server that is
 * unreachable must not turn into a failed submission - the entry is safe, and
 * the caller only needs to say that the notification did not go out.
 */
export async function deliver(
  label: string,
  email: ComposedEmail,
  routing: {
    to: string | string[];
    cc?: string | string[];
    replyTo?: string;
    attachments?: MailAttachment[];
  },
): Promise<{ delivered: boolean; reason?: string }> {
  if (!isMailConfigured()) {
    return { delivered: false, reason: "Email delivery is not configured on the server." };
  }
  try {
    await sendComposed(email, routing);
    return { delivered: true };
  } catch (error) {
    console.error(`[mail] ${label} could not be delivered:`, error);
    return { delivered: false, reason: describeMailError(error) };
  }
}

/**
 * A best-effort send for courtesy copies (acknowledgements, mentor copies).
 *
 * The primary delivery is what the submitter is told about; a failing
 * acknowledgement should never turn a successful submission into an error.
 */
export async function sendQuietly(
  label: string,
  email: ComposedEmail,
  routing: { to: string | string[]; cc?: string | string[]; replyTo?: string; attachments?: MailAttachment[] },
): Promise<boolean> {
  const recipients = Array.isArray(routing.to) ? routing.to : [routing.to];
  if (recipients.filter(Boolean).length === 0) return false;

  try {
    await sendComposed(email, routing);
    return true;
  } catch (error) {
    console.error(`[mail] ${label} could not be delivered:`, error);
    return false;
  }
}
