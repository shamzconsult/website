"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Database,
  Download,
  ExternalLink,
  FileDown,
  LogOut,
  Mail,
  Minus,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
} from "lucide-react-v1";

import { ActivityCharts } from "@/app/(portal)/mentorship/admin/Charts";
import { SiteFooter, SiteHeader } from "@/mentorship/components/SiteHeader";
import { StatusMessage } from "@/mentorship/components/StatusMessage";
import { HOST_COMPANY, PROGRAM, monthLabel } from "@/mentorship/data/program";
import type { MenteeRow, MentorRow, Overview, Rate, Totals } from "@/mentorship/lib/overview";
import { cn } from "@/mentorship/lib/utils";

/** Every dataset the organiser can open or download. Keys match the export route. */
const DATASETS = [
  { key: "mentee-intake", label: "Mentee intake" },
  { key: "mentor-intake", label: "Mentor intake" },
  { key: "mentor-reports", label: "Monthly mentor reports" },
  { key: "mentee-messages", label: "Mentee messages" },
  { key: "call-logs", label: "Call logs" },
  { key: "mentee-final", label: "Mentee final evaluations" },
  { key: "mentor-final", label: "Mentor final evaluations" },
];

export function Dashboard({
  overview,
  generatedOn,
}: {
  overview: Overview;
  /** Formatted on the server, so the printed report is dated without a
      hydration mismatch between the server clock and the browser's. */
  generatedOn: string;
}) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();


  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-ink-50 print:bg-white">
        {/* ---------- Printed report header ---------- */}
        <div className="hidden print:mb-6 print:block">
          <h1 className="text-xl font-bold text-ink-900">
            {PROGRAM.name} — programme dashboard
          </h1>
          <p className="mt-1 text-xs text-ink-500">
            {HOST_COMPANY.name}
            {` · generated ${generatedOn}`}
          </p>
        </div>

        {/* ---------- Banner ---------- */}
        <div className="relative overflow-hidden bg-ink-950 pb-16 pt-10 sm:pb-20 print:hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="grid-texture absolute inset-0 opacity-60" />
            <div className="absolute -right-20 -top-24 size-80 rounded-full bg-brand-600/25 blur-[90px]" />
          </div>

          <div className="relative mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 sm:px-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-300">
                <ShieldCheck className="size-3.5" aria-hidden />
                Organiser
              </span>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Administrative Dashboard
              </h1>
              <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-ink-300">
                Who has submitted, who has not, and everyxx response in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 print:hidden">
              <button
                type="button"
                // The browser's own print-to-PDF: it renders the charts exactly
                // as they appear, needs no library, and lets the organiser pick
                // the page size. The print stylesheet drops the page chrome.
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                <FileDown className="size-4" aria-hidden />
                Download PDF
              </button>
              <button
                type="button"
                onClick={() => startRefresh(() => router.refresh())}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                <RefreshCw className={cn("size-4", refreshing && "animate-spin")} aria-hidden />
                Refresh
              </button>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                <LogOut className="size-4" aria-hidden />
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* ---------- Body ---------- */}
        <div className="mx-auto mt-8 max-w-7xl space-y-6 px-4 pb-20 sm:px-6 print:mt-0 print:px-0 print:pb-0"> 
          <div className="print:hidden">
            <HealthStrip health={overview.health} />
          </div>

          {overview.message && (
            <StatusMessage tone={overview.ok ? "warning" : "error"}>
              {overview.message}
            </StatusMessage>
          )}

          {overview.totals && (
            <>
              <CompletionRates totals={overview.totals} />
              {overview.charts && <ActivityCharts charts={overview.charts} />}
              <MentorTable mentors={overview.mentors} months={overview.months} />
              <MenteeTable mentees={overview.mentees} months={overview.months} />
              <Exports />
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

/* ==========================================================================
 * SECTIONS
 * ========================================================================== */

function HealthStrip({ health }: { health: Overview["health"] }) {
  const items = [
    { label: "Neon database", ok: health.database, icon: Database, hint: "DATABASE_URL" },
    {
      // Naming the route makes it obvious which settings to go and fix.
      label: health.emailTransport === "brevo" ? "Email (Brevo API)" : "Email (SMTP)",
      ok: health.email,
      icon: Mail,
      hint: "BREVO_API_KEY / MAIL_FROM_ADDRESS",
      // A rejected login is the failure that actually stops forms sending, so
      // say exactly what went wrong rather than "not configured".
      detail: health.emailReason,
    },
    { label: "Cloudinary", ok: health.cloudinary, icon: UploadCloud, hint: "CLOUDINARY_*" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm",
            item.ok ? "border-ink-100" : "border-amber-200",
          )}
        >
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-xl",
              item.ok ? "bg-teal-50 text-teal-600" : "bg-amber-50 text-amber-600",
            )}
          >
            <item.icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink-900">{item.label}</p>
            <p className="text-xs text-ink-500">
              {item.ok
                ? "Connected"
                : ("detail" in item && item.detail) || `Not configured — set ${item.hint}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CompletionRates({ totals }: { totals: Totals }) {
  return (
    <div className="space-y-6">
      {/* ---- Headline numbers ---- */}
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Mentors" value={String(totals.mentors)} />
        <Stat
          label="Mentees"
          value={String(totals.mentees)}
          hint={totals.unassignedMentees > 0 ? `${totals.unassignedMentees} unassigned` : undefined}
        />
        <Stat label="Monthly reports" value={String(totals.reports)} />
        <Stat label="Calls logged" value={String(totals.calls)} />
        <Stat label="Mentee messages" value={String(totals.messages)} />
        <Stat
          label="Avg. mentor rating"
          value={
            totals.averageScores.aboutMentors === null
              ? "—"
              : `${totals.averageScores.aboutMentors.toFixed(2)}/5`
          }
        />
      </dl>

      {/* ---- Completion rates ---- */}
      <Card
        title="Completion rates"
        subtitle="How much of what we asked for has actually come in, for each side."
      >
        <div className="grid gap-5 sm:grid-cols-3">
          <RatePair
            title="Intake form"
            hint="Once, before the mentorship starts"
            mentor={totals.intake.mentor}
            mentee={totals.intake.mentee}
          />
          <RatePair
            title="Monthly reporting"
            hint="Mentor reports filed, and the mentees they covered"
            mentor={totals.monthlyReporting.mentor}
            mentee={totals.monthlyReporting.mentee}
          />
          <RatePair
            title="Final evaluation"
            hint="Once, at the end of the programme"
            mentor={totals.finalEvaluation.mentor}
            mentee={totals.finalEvaluation.mentee}
          />
        </div>
      </Card>
    </div>
  );
}

function MentorTable({ mentors, months }: { mentors: MentorRow[]; months: string[] }) {
  return (
    <Card
      title={`Mentors (${mentors.length})`}
      subtitle="A tick means a monthly report was filed for that month."
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-left">
              <Th>Mentor</Th>
              <Th>Group</Th>
              <Th center>Intake</Th>
              {months.map((month) => (
                <Th key={month} center>
                  {shortMonth(month)}
                </Th>
              ))}
              <Th center>Calls</Th>
              <Th center>Final</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {mentors.map((mentor) => (
              <tr key={mentor.id} className="transition hover:bg-ink-50/60">
                <Td>
                  <p className="font-semibold text-ink-900">{mentor.name}</p>
                  <p className="text-xs text-ink-500">
                    {mentor.contactable ? mentor.email : "No email on file"}
                    {mentor.phone && ` · ${mentor.phone}`}
                  </p>
                </Td>
                <Td>
                  <span className="text-ink-600">Group {mentor.groupId}</span>
                  <span className="block text-xs text-ink-400">
                    {mentor.menteeCount} mentee{mentor.menteeCount === 1 ? "" : "s"}
                  </span>
                </Td>
                <Td center>
                  <Tick done={mentor.intakeDone} />
                </Td>
                {mentor.monthly.map((month) => (
                  <Td key={month.period} center>
                    <Tick
                      done={month.submitted}
                      count={month.reports > 1 ? month.reports : undefined}
                    />
                  </Td>
                ))}
                <Td center>
                  <span className="text-ink-600">{mentor.callsLogged}</span>
                </Td>
                <Td center>
                  <Tick
                    done={mentor.finalDone}
                    partial={mentor.finalSheets > 0 && !mentor.finalDone}
                    count={
                      mentor.finalSheets > 0 && !mentor.finalDone ? mentor.finalSheets : undefined
                    }
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function MenteeTable({ mentees, months }: { mentees: MenteeRow[]; months: string[] }) {
  const [onlyOutstanding, setOnlyOutstanding] = useState(false);

  const rows = onlyOutstanding
    ? mentees.filter(
        (mentee) => !mentee.intakeDone || mentee.monthsCovered < months.length || !mentee.finalDone,
      )
    : mentees;

  return (
    <Card
      title={`Mentees (${mentees.length})`}
      subtitle="A tick means their mentor covered them in that month's report."
      action={
        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-ink-600 print:hidden">
          <input
            type="checkbox"
            checked={onlyOutstanding}
            onChange={(event) => setOnlyOutstanding(event.target.checked)}
            className="size-4 rounded border-ink-300 accent-brand-500"
          />
          Only those with something outstanding
        </label>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-left">
              <Th>Mentee</Th>
              <Th>Mentor</Th>
              <Th center>Intake</Th>
              {months.map((month) => (
                <Th key={month} center>
                  {shortMonth(month)}
                </Th>
              ))}
              <Th center>Calls</Th>
              <Th center>Msgs</Th>
              <Th center>Final</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={months.length + 6} className="px-3 py-8 text-center text-ink-500">
                  Everyone is up to date.
                </td>
              </tr>
            )}

            {rows.map((mentee) => (
              <tr key={mentee.id} className="transition hover:bg-ink-50/60">
                <Td>
                  <p className="font-semibold text-ink-900">{mentee.name}</p>
                  <p className="text-xs text-ink-500">{mentee.email || "No email on file"}</p>
                </Td>
                <Td>
                  {mentee.mentorName ? (
                    <span className="text-ink-600">{mentee.mentorName}</span>
                  ) : (
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      Unassigned
                    </span>
                  )}
                </Td>
                <Td center>
                  <Tick done={mentee.intakeDone} />
                </Td>
                {mentee.monthly.map((month) => (
                  <Td key={month.period} center>
                    <Tick done={month.covered} />
                  </Td>
                ))}
                <Td center>
                  <span className="text-ink-600">{mentee.calls}</span>
                </Td>
                <Td center>
                  <span className="text-ink-600">{mentee.messages}</span>
                </Td>
                <Td center>
                  <Tick done={mentee.finalDone} />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Exports() {
  return (
    <Card
      title="Open & export"
      subtitle="Read any dataset in the browser, or download it as a spreadsheet."
      className="print:hidden"
    >
      <ul className="divide-y divide-ink-100">
        {DATASETS.map((dataset) => (
          <li key={dataset.key} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <span className="text-sm font-semibold text-ink-800">{dataset.label}</span>
            <span className="flex gap-2">
              <a
                href={`/api/admin/export?dataset=${dataset.key}&format=json`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-2 text-xs font-semibold text-ink-700 transition hover:bg-ink-50"
              >
                <ExternalLink className="size-3.5" aria-hidden />
                Open
              </a>
              <a
                href={`/api/admin/export?dataset=${dataset.key}&format=csv`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-600"
              >
                <Download className="size-3.5" aria-hidden />
                CSV
              </a>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-ink-500">
        To open one response on its own, append{" "}
        <code className="rounded bg-ink-100 px-1 py-0.5">&amp;id=</code> and its row id to the Open
        link — the row ids are in the JSON view.
      </p>
    </Card>
  );
}

/* ==========================================================================
 * SMALL PIECES
 * ========================================================================== */

/** "2026-08" -> "Aug" */
const shortMonth = (period: string) => monthLabel(period).slice(0, 3);

function Card({
  title,
  subtitle,
  action,
  className,
  children,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn("rounded-2xl border border-ink-100 bg-white p-5 shadow-sm sm:p-6", className)}
    >
      {(title || action) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-ink-900">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white px-4 py-4">
      <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-400">{label}</dt>
      <dd className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold text-ink-900">
        {value}
      </dd>
      {hint && <p className="mt-0.5 text-[11px] font-medium text-amber-600">{hint}</p>}
    </div>
  );
}

function RatePair({
  title,
  hint,
  mentor,
  mentee,
}: {
  title: string;
  hint: string;
  mentor: Rate;
  mentee: Rate;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-4">
      <p className="text-sm font-bold text-ink-900">{title}</p>
      <p className="mt-0.5 text-xs text-ink-500">{hint}</p>

      <div className="mt-4 space-y-3">
        <Bar label="Mentors" rate={mentor} tone="brand" />
        <Bar label="Mentees" rate={mentee} tone="teal" />
      </div>
    </div>
  );
}

function Bar({ label, rate, tone }: { label: string; rate: Rate; tone: "brand" | "teal" }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold text-ink-600">{label}</span>
        <span className="text-xs font-bold text-ink-900">
          {Math.round(rate.rate)}%
          <span className="ml-1 font-medium text-ink-400">
            ({rate.done}/{rate.total})
          </span>
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-200">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            tone === "brand" ? "bg-brand-500" : "bg-teal-600",
          )}
          style={{ width: `${Math.min(100, rate.rate)}%` }}
        />
      </div>
    </div>
  );
}

function Tick({
  done,
  partial = false,
  count,
}: {
  done: boolean;
  partial?: boolean;
  count?: number;
}) {
  if (done) {
    return (
      <span className="mx-auto grid size-6 place-items-center rounded-full bg-teal-100 text-teal-700">
        {count ? (
          <span className="text-[10px] font-bold">{count}</span>
        ) : (
          <Check className="size-3.5" aria-hidden />
        )}
        <span className="sr-only">Submitted</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "mx-auto grid size-6 place-items-center rounded-full",
        partial ? "bg-amber-100 text-amber-700" : "bg-ink-100 text-ink-300",
      )}
    >
      {partial && count ? (
        <span className="text-[10px] font-bold">{count}</span>
      ) : (
        <Minus className="size-3.5" aria-hidden />
      )}
      <span className="sr-only">{partial ? "Partly submitted" : "Not submitted"}</span>
    </span>
  );
}

function Th({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <th
      className={cn(
        "px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500",
        center && "text-center",
      )}
    >
      {children}
    </th>
  );
}

function Td({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return <td className={cn("px-3 py-3 align-middle", center && "text-center")}>{children}</td>;
}
