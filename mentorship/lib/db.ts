import { neon } from "@neondatabase/serverless";

/* ============================================================================
 * NEON POSTGRES
 * ============================================================================
 * Set DATABASE_URL in .env.local to your Neon pooled connection string:
 *
 *   DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require
 *
 * The whole app degrades gracefully when it is missing: forms still send their
 * emails, they just are not recorded, and the admin dashboard says so plainly.
 * ==========================================================================*/

const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "";

export function isDbConfigured() {
  return DATABASE_URL.length > 0;
}

/** A row as it comes back from Postgres. Callers narrow what they need. */
export type Row = Record<string, unknown>;

/**
 * The neon driver types its return as a union covering every `fullResults` /
 * `arrayMode` combination. We always use the defaults — rows as objects — so
 * this narrows it once here instead of at every call site.
 */
interface Sql {
  <T = Row>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T[]>;
  query<T = Row>(text: string, params?: unknown[]): Promise<T[]>;
}

let client: Sql | null = null;

/** The tagged-template query function. Throws if DATABASE_URL is missing. */
export function db(): Sql {
  if (!isDbConfigured()) {
    throw new Error("DATABASE_URL is not set. Add your Neon connection string to .env.local.");
  }
  if (!client) client = neon(DATABASE_URL) as unknown as Sql;
  return client;
}

/* --------------------------------------------------------------------------
 * SCHEMA
 * --------------------------------------------------------------------------
 * Created on first use and then remembered for the life of the process. Every
 * statement is idempotent, so this is safe to run on every cold start.
 * ------------------------------------------------------------------------*/

const SCHEMA: string[] = [
  `CREATE TABLE IF NOT EXISTS mentee_intake (
     id           bigserial PRIMARY KEY,
     mentee_id    text NOT NULL UNIQUE,
     mentee_name  text NOT NULL,
     mentee_email text NOT NULL DEFAULT '',
     mentor_id    text NOT NULL DEFAULT '',
     mentor_name  text NOT NULL DEFAULT '',
     answers      jsonb NOT NULL,
     created_at   timestamptz NOT NULL DEFAULT now()
   )`,

  `CREATE TABLE IF NOT EXISTS mentor_intake (
     id           bigserial PRIMARY KEY,
     mentor_id    text NOT NULL UNIQUE,
     mentor_name  text NOT NULL,
     mentor_email text NOT NULL DEFAULT '',
     answers      jsonb NOT NULL,
     created_at   timestamptz NOT NULL DEFAULT now()
   )`,

  `CREATE TABLE IF NOT EXISTS mentee_messages (
     id           bigserial PRIMARY KEY,
     mentee_id    text NOT NULL,
     mentee_name  text NOT NULL,
     mentee_email text NOT NULL DEFAULT '',
     mentor_id    text NOT NULL DEFAULT '',
     mentor_name  text NOT NULL DEFAULT '',
     group_id     integer,
     message      text NOT NULL,
     resources    jsonb NOT NULL DEFAULT '[]'::jsonb,
     created_at   timestamptz NOT NULL DEFAULT now()
   )`,

  `CREATE TABLE IF NOT EXISTS mentor_reports (
     id              bigserial PRIMARY KEY,
     mentor_id       text NOT NULL,
     mentor_name     text NOT NULL,
     group_id        integer,
     period          text NOT NULL,
     session_date    date NOT NULL,
     general_comment text NOT NULL DEFAULT '',
     mentee_feedback jsonb NOT NULL,
     resources       jsonb NOT NULL DEFAULT '[]'::jsonb,
     created_at      timestamptz NOT NULL DEFAULT now()
   )`,

  `CREATE INDEX IF NOT EXISTS mentor_reports_period_idx ON mentor_reports (period)`,

  `CREATE TABLE IF NOT EXISTS call_logs (
     id          bigserial PRIMARY KEY,
     logged_by   text NOT NULL,
     mentor_id   text NOT NULL DEFAULT '',
     mentor_name text NOT NULL DEFAULT '',
     mentee_id   text NOT NULL DEFAULT '',
     mentee_name text NOT NULL DEFAULT '',
     call_date   date NOT NULL,
     period      text NOT NULL,
     mode        text NOT NULL,
     note        text NOT NULL DEFAULT '',
     created_at  timestamptz NOT NULL DEFAULT now()
   )`,

  `CREATE INDEX IF NOT EXISTS call_logs_period_idx ON call_logs (period)`,

  `CREATE TABLE IF NOT EXISTS mentee_final_evaluations (
     id           bigserial PRIMARY KEY,
     mentee_id    text NOT NULL UNIQUE,
     mentee_name  text NOT NULL,
     mentee_email text NOT NULL DEFAULT '',
     mentor_id    text NOT NULL DEFAULT '',
     mentor_name  text NOT NULL DEFAULT '',
     location     text NOT NULL DEFAULT '',
     track        text NOT NULL DEFAULT '',
     ratings      jsonb NOT NULL,
     average      numeric(3,2),
     comments     text NOT NULL DEFAULT '',
     created_at   timestamptz NOT NULL DEFAULT now()
   )`,

  `CREATE TABLE IF NOT EXISTS mentor_final_evaluations (
     id              bigserial PRIMARY KEY,
     mentor_id       text NOT NULL,
     mentor_name     text NOT NULL,
     mentee_id       text NOT NULL,
     mentee_name     text NOT NULL,
     location        text NOT NULL DEFAULT '',
     track           text NOT NULL DEFAULT '',
     ratings         jsonb NOT NULL,
     average         numeric(3,2),
     recommendations text NOT NULL DEFAULT '',
     created_at      timestamptz NOT NULL DEFAULT now(),
     UNIQUE (mentor_id, mentee_id)
   )`,
];

let schemaReady: Promise<void> | null = null;

/** Ensures every table exists. Safe (and cheap) to await before any query. */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    const sql = db();
    schemaReady = (async () => {
      for (const statement of SCHEMA) {
        await sql.query(statement);
      }
    })().catch((error) => {
      // Let the next request try again rather than caching a failure forever.
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

/**
 * Records a submission without ever failing the request.
 *
 * Delivery by email is the promise we make to mentors and mentees; the
 * database is the organiser's record of it. If Neon is unreachable we log it
 * and let the email stand, rather than telling someone their report bounced.
 */
export async function record(label: string, write: () => Promise<unknown>): Promise<boolean> {
  if (!isDbConfigured()) return false;
  try {
    await ensureSchema();
    await write();
    return true;
  } catch (error) {
    console.error(`[db] ${label} failed to persist:`, error);
    return false;
  }
}
