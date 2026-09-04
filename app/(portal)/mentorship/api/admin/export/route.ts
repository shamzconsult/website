import { NextResponse } from "next/server";

import {
  MENTEE_FINAL_STATEMENTS,
  MENTEE_INTAKE_QUESTIONS,
  MENTOR_FINAL_STATEMENTS,
  MENTOR_INTAKE_QUESTIONS,
} from "@/mentorship/data/forms";
import { db, ensureSchema, isDbConfigured } from "@/mentorship/lib/db";
import { requireAdmin } from "@/mentorship/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATASETS = {
  "mentee-intake": {
    label: "Mentee intake",
    table: "mentee_intake",
    /** Columns lifted out of the jsonb blob, in form order. */
    expand: { column: "answers", keys: MENTEE_INTAKE_QUESTIONS.map((q) => q.id) },
  },
  "mentor-intake": {
    label: "Mentor intake",
    table: "mentor_intake",
    expand: { column: "answers", keys: MENTOR_INTAKE_QUESTIONS.map((q) => q.id) },
  },
  "mentee-messages": {
    label: "Mentee messages",
    table: "mentee_messages",
    expand: null,
  },
  "mentor-reports": {
    label: "Monthly mentor reports",
    table: "mentor_reports",
    expand: null,
  },
  "call-logs": {
    label: "Call logs",
    table: "call_logs",
    expand: null,
  },
  "mentee-final": {
    label: "Mentee final evaluations",
    table: "mentee_final_evaluations",
    expand: { column: "ratings", keys: MENTEE_FINAL_STATEMENTS.map((s) => s.id) },
  },
  "mentor-final": {
    label: "Mentor final evaluations",
    table: "mentor_final_evaluations",
    expand: { column: "ratings", keys: MENTOR_FINAL_STATEMENTS.map((s) => s.id) },
  },
} as const;

type DatasetKey = keyof typeof DATASETS;

const isDataset = (value: string): value is DatasetKey =>
  Object.prototype.hasOwnProperty.call(DATASETS, value);

export async function GET(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, message: "No DATABASE_URL is set, so there is nothing recorded to export." },
      { status: 409 },
    );
  }

  const url = new URL(request.url);
  const dataset = url.searchParams.get("dataset") ?? "";
  const format = url.searchParams.get("format") === "csv" ? "csv" : "json";
  const id = url.searchParams.get("id");

  if (!isDataset(dataset)) {
    return NextResponse.json(
      { ok: false, message: `Unknown dataset. Choose one of: ${Object.keys(DATASETS).join(", ")}.` },
      { status: 400 },
    );
  }

  const config = DATASETS[dataset];

  try {
    await ensureSchema();
    const sql = db();

    // The table name comes from our own closed list above, never from input.
    const rows = id
      ? await sql.query(`SELECT * FROM ${config.table} WHERE id = $1`, [Number(id)])
      : await sql.query(`SELECT * FROM ${config.table} ORDER BY created_at DESC`);

    const records = rows as Array<Record<string, unknown>>;

    if (id && records.length === 0) {
      return NextResponse.json({ ok: false, message: "No such response." }, { status: 404 });
    }

    if (format === "json") {
      const payload = id
        ? { ok: true, dataset, label: config.label, response: records[0] }
        : { ok: true, dataset, label: config.label, count: records.length, responses: records };

      return new NextResponse(JSON.stringify(payload, null, 2), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `inline; filename="${dataset}${id ? `-${id}` : ""}.json"`,
        },
      });
    }

    return new NextResponse(toCsv(records, config.expand), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${dataset}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error(`[admin/export] ${dataset} failed:`, error);
    return NextResponse.json({ ok: false, message: "The export failed." }, { status: 502 });
  }
}

/* --------------------------------------------------------------------------
 * CSV
 * ------------------------------------------------------------------------*/

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text =
    value instanceof Date
      ? value.toISOString()
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);

  // A leading =, +, - or @ makes a spreadsheet treat the cell as a formula.
  const guarded = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${guarded.replace(/"/g, '""')}"`;
}

function toCsv(
  records: Array<Record<string, unknown>>,
  expand: { column: string; keys: readonly string[] } | null,
): string {
  if (records.length === 0) return "No responses yet\n";

  const flat = records.map((row) => {
    if (!expand) return row;

    const { [expand.column]: blob, ...rest } = row;
    const values = (blob ?? {}) as Record<string, unknown>;
    const expanded: Record<string, unknown> = { ...rest };
    for (const key of expand.keys) expanded[key] = values[key] ?? "";
    return expanded;
  });

  const headers = Array.from(new Set(flat.flatMap((row) => Object.keys(row))));

  return [
    headers.map(cell).join(","),
    ...flat.map((row) => headers.map((header) => cell(row[header])).join(",")),
  ].join("\n");
}
