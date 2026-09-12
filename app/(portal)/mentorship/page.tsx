import Link from "next/link";
import {
  Award,
  ClipboardList,
  Lock,
  MessageSquareText,
  PhoneCall,
  Sparkles,
  type LucideIcon,
} from "lucide-react-v1";

import { RoleCard } from "@/mentorship/components/RoleCard";
import { SiteFooter, SiteHeader } from "@/mentorship/components/SiteHeader";
import { MENTORS, PROGRAM, PROGRAM_MONTHS, STUDENTS } from "@/mentorship/data/program";

export default function RoleSelectionPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative flex-1 overflow-hidden">
        {/* ---------- Ambient background ---------- */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="grid-texture absolute inset-0 opacity-70" />
          <div className="absolute -left-32 -top-24 size-[30rem] animate-float rounded-full bg-brand-600/25 blur-[110px]" />
          <div
            className="absolute -right-24 top-32 size-[26rem] animate-float rounded-full bg-teal-500/20 blur-[110px]"
            style={{ animationDelay: "2.5s" }}
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          {/* ---------- Intro ---------- */}
          <div className="max-w-2xl">
            <span className="inline-flex animate-rise items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300 backdrop-blur">
              <Sparkles className="size-3.5" aria-hidden />
              {PROGRAM.sponsor} × {PROGRAM.facilitator}
            </span>

            <h1
              className="mt-6 animate-rise font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[56px]"
              style={{ animationDelay: "60ms" }}
            >
              Mentorship{" "}
              <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-teal-400 bg-clip-text text-transparent">
                Feedback
              </span>{" "}
              Channel
            </h1>

            <p
              className="mt-5 animate-rise text-base leading-relaxed text-ink-300 sm:text-lg"
              style={{ animationDelay: "120ms" }}
            >
              The monthly touchpoint for our {PROGRAM.name}. Mentors report on how their group is
              progressing, and mentees reach their mentor directly — all in one place.
            </p>

            <p
              className="mt-8 animate-rise text-xs font-semibold uppercase tracking-[0.18em] text-ink-400"
              style={{ animationDelay: "160ms" }}
            >
              Select how you are joining today
            </p>
          </div>

          {/* ---------- The two doors ---------- */}
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <RoleCard
              href="/mentor"
              accent="brand"
              eyebrow="For Mentors"
              title="I'm a Mentor"
              description={`Submit your monthly session report. It goes straight to ${PROGRAM.facilitator}.`}
              bullets={[
                "Pick the mentees you met with this month",
                "Answer six evaluation questions for each",
                "Share your slides and session resources",
              ]}
              cta="Start monthly report"
              icon={ClipboardList}
              delay="200ms"
            />

            <RoleCard
              href="/mentee"
              accent="teal"
              eyebrow="For Mentees"
              title="I'm a Mentee"
              description="Send a question, a comment or a document straight to your assigned mentor."
              bullets={[
                "Ask for guidance or clarification",
                "Share progress or something on your mind",
                "Attach a document or presentation",
              ]}
              cta="Message my mentor"
              icon={MessageSquareText}
              delay="280ms"
            />
          </div>

          {/* ---------- Everything else the programme asks for ---------- */}
          <section
            className="mt-10 animate-rise"
            style={{ animationDelay: "320ms" }}
            aria-labelledby="other-forms"
          >
            <h2
              id="other-forms"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400"
            >
              Across the programme
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <QuickLink
                href="/mentee/intake"
                icon={Sparkles}
                title="Mentee intake"
                hint="Interest & expectations — filled once, before we begin"
              />
              <QuickLink
                href="/mentor/intake"
                icon={Sparkles}
                title="Mentor intake"
                hint="Interest, expectations & info — filled once, before we begin"
              />
              <QuickLink
                href="/call-log"
                icon={PhoneCall}
                title="Log a call"
                hint="Date, mode and a short note. Either side, any time"
              />
              <QuickLink
                href="/mentee/final-evaluation"
                icon={Award}
                title="Final evaluation"
                hint="The end-of-programme rating sheets"
              />
            </div>
          </section>

          {/* ---------- Quiet reassurance strip ---------- */}
          <dl
            className="mt-12 grid animate-rise grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4"
            style={{ animationDelay: "380ms" }}
          >
            {[
              { label: "Participants", value: String(STUDENTS.length) },
              { label: "Mentorship groups", value: String(MENTORS.length) },
              { label: "Cadence", value: PROGRAM.cadence },
              { label: "Programme", value: `${PROGRAM_MONTHS.length} months` },
            ].map((stat) => (
              <div key={stat.label} className="bg-ink-950/80 px-5 py-4 backdrop-blur">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* ---------- Organiser door ---------- */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-ink-400 transition hover:border-white/25 hover:text-ink-200"
            >
              <Lock className="size-3.5" aria-hidden />
              Organiser dashboard
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  hint,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="glass-card group rounded-2xl p-4 transition hover:border-white/25 hover:bg-white/10"
    >
      <Icon className="size-5 text-brand-400 transition group-hover:text-brand-300" aria-hidden />
      <p className="mt-3 text-sm font-bold text-white">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-400">{hint}</p>
    </Link>
  );
}
