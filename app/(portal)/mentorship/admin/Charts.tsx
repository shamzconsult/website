"use client";

import { useState } from "react";
import { BarChart3, PhoneCall, Table2 } from "lucide-react-v1";

import type { Charts, CallsMonth, SubmissionsMonth } from "@/mentorship/lib/overview";
import { cn } from "@/mentorship/lib/utils";

const MENTOR = "#f9601a";
const MENTEE = "#14b0a5";
const SINGLE = "#486393";

/** Recessive chrome. Hairline gridlines, muted ticks — never competing ink. */
const GRID = "#e7ebf4";

export function ActivityCharts({ charts }: { charts: Charts }) {
  return (
    <div className="space-y-6">
      <CallLogCharts charts={charts} />
      <SubmissionCharts months={charts.submissionsByMonth} />
    </div>
  );
}

function CallLogCharts({ charts }: { charts: Charts }) {
  const total = charts.callsByMonth.reduce((sum, month) => sum + month.total, 0);

  return (
    <ChartCard
      icon={PhoneCall}
      title="Call logs"
      subtitle="Every mentorship call that has been logged, by the month the call took place."
      tableId="call-logs-table"
      table={<CallTable months={charts.callsByMonth} />}
    >
      {total === 0 ? (
        <Empty>No calls have been logged yet.</Empty>
      ) : (
        <div className="space-y-8">
          <div>
            <Legend
              items={[
                { label: "Logged by the mentor", color: MENTOR },
                { label: "Logged by the mentee", color: MENTEE },
              ]}
            />
            <StackedColumns months={charts.callsByMonth} />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <RankedBars
              title="How the calls happened"
              rows={charts.callsByMode.map((mode) => ({ label: mode.label, value: mode.count }))}
              unit="call"
            />
            <RankedBars
              title="Calls logged per mentor"
              rows={charts.callsByMentor.map((mentor) => ({
                label: mentor.label,
                value: mentor.count,
              }))}
              unit="call"
            />
          </div>
        </div>
      )}
    </ChartCard>
  );
}

/** Calls per month, split by who filed the entry. */
function StackedColumns({ months }: { months: CallsMonth[] }) {
  const max = niceMax(Math.max(1, ...months.map((month) => month.total)));
  const ticks = tickValues(max);
  const peak = months.reduce((best, month) => (month.total > best.total ? month : best), months[0]);

  return (
    <Plot ticks={ticks} max={max}>
      {months.map((month) => (
        <Column
          key={month.period}
          label={month.label}
          tooltip={
            <>
              <TipLine label="Total calls" value={month.total} strong />
              <TipLine label="By the mentor" value={month.byMentor} color={MENTOR} />
              <TipLine label="By the mentee" value={month.byMentee} color={MENTEE} />
            </>
          }
        >
          {/* The peak is the one column worth a number of its own; the axis
              ticks and the tooltip carry every other value. */}
          <Stack
            max={max}
            capLabel={month.total > 0 && month.period === peak.period ? month.total : null}
            segments={[
              { value: month.byMentee, color: MENTEE },
              { value: month.byMentor, color: MENTOR },
            ]}
          />
        </Column>
      ))}
    </Plot>
  );
}

function CallTable({ months }: { months: CallsMonth[] }) {
  return (
    <MiniTable
      head={["Month", "By the mentor", "By the mentee", "Total"]}
      rows={months.map((month) => [month.label, month.byMentor, month.byMentee, month.total])}
      totals={[
        "All months",
        sumOf(months, (m) => m.byMentor),
        sumOf(months, (m) => m.byMentee),
        sumOf(months, (m) => m.total),
      ]}
    />
  );
}

/* ==========================================================================
 * 2. SUBMISSIONS RECEIVED
 * ========================================================================== */

function SubmissionCharts({ months }: { months: SubmissionsMonth[] }) {
  const total = months.reduce((sum, month) => sum + month.total, 0);

  return (
    <ChartCard
      icon={BarChart3}
      title="Submissions received each month"
      subtitle="Intake forms, monthly reports, messages, call logs and final evaluation sheets, by the month they arrived."
      tableId="submissions-table"
      table={<SubmissionTable months={months} />}
    >
      {total === 0 ? (
        <Empty>Nothing has been submitted yet.</Empty>
      ) : (
        <div>
          <Legend
            items={[
              { label: "From mentors", color: MENTOR },
              { label: "From mentees", color: MENTEE },
            ]}
          />
          <GroupedColumns months={months} />
        </div>
      )}
    </ChartCard>
  );
}

function GroupedColumns({ months }: { months: SubmissionsMonth[] }) {
  const max = niceMax(Math.max(1, ...months.flatMap((month) => [month.mentor, month.mentee])));
  const ticks = tickValues(max);

  return (
    <Plot ticks={ticks} max={max}>
      {months.map((month) => (
        <Column
          key={month.period}
          label={month.label}
          tooltip={
            <>
              <TipLine label="From mentors" value={month.mentor} color={MENTOR} strong />
              <TipSub label="Intake" value={month.breakdown.mentorIntake} />
              <TipSub label="Monthly reports" value={month.breakdown.mentorReports} />
              <TipSub label="Call logs" value={month.breakdown.mentorCalls} />
              <TipSub label="Final evaluation" value={month.breakdown.mentorFinal} />
              <TipLine label="From mentees" value={month.mentee} color={MENTEE} strong />
              <TipSub label="Intake" value={month.breakdown.menteeIntake} />
              <TipSub label="Messages" value={month.breakdown.menteeMessages} />
              <TipSub label="Call logs" value={month.breakdown.menteeCalls} />
              <TipSub label="Final evaluation" value={month.breakdown.menteeFinal} />
            </>
          }
        >
          {/* 2px of surface between the pair, same as the stack's spacer. */}
          <div className="flex h-full w-full items-end justify-center gap-[2px]">
            <Pillar value={month.mentor} max={max} color={MENTOR} />
            <Pillar value={month.mentee} max={max} color={MENTEE} />
          </div>
        </Column>
      ))}
    </Plot>
  );
}

function SubmissionTable({ months }: { months: SubmissionsMonth[] }) {
  const forms = [
    ["Mentor · intake", (m: SubmissionsMonth) => m.breakdown.mentorIntake],
    ["Mentor · monthly report", (m: SubmissionsMonth) => m.breakdown.mentorReports],
    ["Mentor · call log", (m: SubmissionsMonth) => m.breakdown.mentorCalls],
    ["Mentor · final evaluation", (m: SubmissionsMonth) => m.breakdown.mentorFinal],
    ["Mentee · intake", (m: SubmissionsMonth) => m.breakdown.menteeIntake],
    ["Mentee · message", (m: SubmissionsMonth) => m.breakdown.menteeMessages],
    ["Mentee · call log", (m: SubmissionsMonth) => m.breakdown.menteeCalls],
    ["Mentee · final evaluation", (m: SubmissionsMonth) => m.breakdown.menteeFinal],
  ] as const;

  return (
    <MiniTable
      head={["Form", ...months.map((month) => month.label), "Total"]}
      rows={forms.map(([label, read]) => [
        label,
        ...months.map(read),
        sumOf(months, read as (m: SubmissionsMonth) => number),
      ])}
      totals={[
        "All submissions",
        ...months.map((month) => month.total),
        sumOf(months, (m) => m.total),
      ]}
    />
  );
}

/* ==========================================================================
 * CHART PRIMITIVES
 * ==========================================================================
 * Plain HTML and CSS rather than an SVG chart library: it stays responsive
 * without a viewBox to fight, prints correctly, and adds no dependency.
 * ========================================================================== */

const PLOT_HEIGHT = 208;

/** The plot area: hairline gridlines, a y-axis of round ticks, and the bands. */
function Plot({ ticks, max, children }: { ticks: number[]; max: number; children: React.ReactNode }) {
  return (
    // Bars are capped at 24px, so on a wide card a handful of months would
    // otherwise sit marooned in their own bands. Cap the plot instead.
    <div className="mt-5 flex max-w-3xl gap-3">
      {/* ---- Y axis ---- */}
      <div
        className="relative w-9 shrink-0 print:w-8"
        style={{ height: PLOT_HEIGHT }}
        aria-hidden
      >
        {ticks.map((tick) => (
          <span
            key={tick}
            className="absolute right-0 -translate-y-1/2 text-[10px] font-medium tabular-nums text-ink-400"
            style={{ bottom: `${(tick / max) * 100}%` }}
          >
            {tick}
          </span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="relative" style={{ height: PLOT_HEIGHT }}>
          {ticks.map((tick) => (
            <span
              key={tick}
              aria-hidden
              className="absolute inset-x-0 border-t"
              style={{ bottom: `${(tick / max) * 100}%`, borderColor: GRID }}
            />
          ))}

          <div className="absolute inset-0 flex items-end gap-2 sm:gap-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** One month band: its marks, its axis label, and its hover target. */
function Column({
  label,
  tooltip,
  children,
}: {
  label: string;
  tooltip: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="group relative flex h-full min-w-0 flex-1 flex-col justify-end"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      {/* The hit target is the whole band, not just the mark. */}
      {open && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-48 -translate-x-1/2 rounded-xl border border-ink-200 bg-white p-3 text-left shadow-lg print:hidden">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-400">
            {label}
          </p>
          {tooltip}
        </div>
      )}

      <div className="h-full w-full">{children}</div>

      <span className="mt-2 block truncate text-center text-[10px] font-semibold text-ink-500">
        {label}
      </span>
    </div>
  );
}

/** A stacked column. Segments are separated by 2px of surface, never a stroke. */
function Stack({
  segments,
  max,
  capLabel,
}: {
  segments: Array<{ value: number; color: string }>;
  max: number;
  capLabel: number | null;
}) {
  const visible = segments.filter((segment) => segment.value > 0);

  return (
    <div className="relative mx-auto flex h-full w-full max-w-[24px] flex-col justify-end gap-[2px]">
      {capLabel !== null && (
        <span
          className="absolute inset-x-0 mb-1 text-center text-[10px] font-bold tabular-nums text-ink-700"
          style={{ bottom: `${(sumOf(segments, (segment) => segment.value) / max) * 100}%` }}
        >
          {capLabel}
        </span>
      )}

      {visible.map((segment, index) => (
        <span
          key={segment.color}
          className={cn("block w-full", index === 0 && "rounded-t")}
          style={{
            height: `${(segment.value / max) * 100}%`,
            background: segment.color,
            // 4px rounded data-end, square where it meets the baseline.
            borderTopLeftRadius: index === 0 ? 4 : undefined,
            borderTopRightRadius: index === 0 ? 4 : undefined,
          }}
        />
      ))}
    </div>
  );
}

/** One bar of a grouped pair. */
function Pillar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <span
      className="block w-full max-w-[24px] rounded-t"
      style={{ height: `${(value / max) * 100}%`, background: color, minHeight: value > 0 ? 2 : 0 }}
    />
  );
}

/**
 * A single-series horizontal bar list. One colour means no legend is needed —
 * the title says what is plotted — so every value rides at its own bar tip.
 */
function RankedBars({
  title,
  rows,
  unit,
}: {
  title: string;
  rows: Array<{ label: string; value: number }>;
  unit: string;
}) {
  const max = Math.max(1, ...rows.map((row) => row.value));

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-500">{title}</p>
      <ul className="mt-3.5 space-y-2.5">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-xs font-medium text-ink-600 sm:w-32">
              {row.label}
            </span>
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className="block h-2.5 rounded-r-[4px]"
                style={{
                  width: `${Math.max(row.value === 0 ? 0 : 2, (row.value / max) * 100)}%`,
                  background: SINGLE,
                }}
              />
              <span className="shrink-0 text-xs font-bold tabular-nums text-ink-700">
                {row.value}
              </span>
              <span className="sr-only">
                {unit}
                {row.value === 1 ? "" : "s"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ==========================================================================
 * SHELL & SMALL PIECES
 * ========================================================================== */

/**
 * Every chart card carries its own table view. It is how the numbers stay
 * available to a screen reader, to anyone who cannot separate the two series
 * by colour, and to the printed PDF.
 */
function ChartCard({
  icon: Icon,
  title,
  subtitle,
  table,
  tableId,
  children,
}: {
  icon: typeof BarChart3;
  title: string;
  subtitle: string;
  table: React.ReactNode;
  tableId: string;
  children: React.ReactNode;
}) {
  const [showTable, setShowTable] = useState(false);

  return (
    <section className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink-50 text-ink-500">
            <Icon className="size-4.5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-ink-900">
              {title}
            </h2>
            <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTable((previous) => !previous)}
          aria-expanded={showTable}
          aria-controls={tableId}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-2 text-xs font-semibold text-ink-700 transition hover:bg-ink-50 print:hidden"
        >
          <Table2 className="size-3.5" aria-hidden />
          {showTable ? "Hide numbers" : "Show numbers"}
        </button>
      </div>

      {children}

      {/* Always in the printed copy; on screen it is behind the toggle. */}
      <div id={tableId} className={cn("mt-6", showTable ? "block" : "hidden print:block")}>
        {table}
      </div>
    </section>
  );
}

function Legend({ items }: { items: Array<{ label: string; color: string }> }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-xs font-medium text-ink-600">
          <span
            aria-hidden
            className="block size-2.5 rounded-sm"
            style={{ background: item.color }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function TipLine({
  label,
  value,
  color,
  strong = false,
}: {
  label: string;
  value: number;
  color?: string;
  strong?: boolean;
}) {
  return (
    <p className="flex items-center gap-2 py-0.5 text-xs">
      {color && (
        <span aria-hidden className="block size-2 rounded-sm" style={{ background: color }} />
      )}
      <span className={cn("flex-1", strong ? "font-semibold text-ink-800" : "text-ink-600")}>
        {label}
      </span>
      <span className="font-bold tabular-nums text-ink-900">{value}</span>
    </p>
  );
}

function TipSub({ label, value }: { label: string; value: number }) {
  return (
    <p className="flex items-center gap-2 pl-4 text-[11px] text-ink-500">
      <span className="flex-1">{label}</span>
      <span className="tabular-nums">{value}</span>
    </p>
  );
}

function MiniTable({
  head,
  rows,
  totals,
}: {
  head: string[];
  rows: Array<Array<string | number>>;
  totals: Array<string | number>;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-ink-100">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-ink-50 text-left">
            {head.map((cell, index) => (
              <th
                key={cell}
                className={cn(
                  "px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500",
                  index > 0 && "text-right",
                )}
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {rows.map((row) => (
            <tr key={String(row[0])}>
              {row.map((cell, index) => (
                <td
                  key={index}
                  className={cn(
                    "px-3 py-2",
                    index === 0
                      ? "font-medium text-ink-700"
                      : "text-right tabular-nums text-ink-600",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-ink-200 bg-ink-50/60">
            {totals.map((cell, index) => (
              <td
                key={index}
                className={cn(
                  "px-3 py-2.5 font-bold text-ink-900",
                  index === 0 ? "text-left" : "text-right tabular-nums",
                )}
              >
                {cell}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-ink-200 bg-ink-50/50 px-4 py-10 text-center text-sm text-ink-500">
      {children}
    </p>
  );
}

/* --------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------*/

const sumOf = <T,>(items: T[], of: (item: T) => number) =>
  items.reduce((total, item) => total + of(item), 0);

/**
 * A clean top of scale, so the axis reads 0 / 2 / 4 rather than 0 / 2 / 3.
 * Counts are whole numbers, so the step is never a fraction.
 */
function niceMax(max: number): number {
  if (max <= 4) return Math.max(1, max % 2 === 0 ? max : max + 1);
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  for (const multiple of [1, 2, 2.5, 5, 10]) {
    const candidate = Math.ceil(max / (step * multiple)) * step * multiple;
    if (candidate >= max && Number.isInteger(candidate / 2)) return candidate;
  }
  return max;
}

/** Zero, the top of the scale, and a midpoint whenever it is a whole number. */
function tickValues(max: number): number[] {
  const mid = max / 2;
  return Number.isInteger(mid) && mid > 0 ? [0, mid, max] : [0, max];
}
