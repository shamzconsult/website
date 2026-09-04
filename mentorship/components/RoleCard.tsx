import Link from "next/link";
import { ArrowRight, Check, type LucideIcon } from "lucide-react-v1";

import { cn } from "@/mentorship/lib/utils";

type Accent = "brand" | "teal";

const ACCENTS: Record<
  Accent,
  { glow: string; tile: string; label: string; bullet: string; cta: string; edge: string }
> = {
  brand: {
    glow: "from-brand-500/25 via-brand-500/5",
    tile: "bg-gradient-to-br from-brand-400 to-brand-600 shadow-brand-500/30",
    label: "text-brand-400",
    bullet: "text-brand-400",
    cta: "bg-brand-500 text-white group-hover:bg-brand-400",
    edge: "group-hover:border-brand-400/50",
  },
  teal: {
    glow: "from-teal-400/25 via-teal-400/5",
    tile: "bg-gradient-to-br from-teal-400 to-teal-600 shadow-teal-500/30",
    label: "text-teal-300",
    bullet: "text-teal-300",
    cta: "bg-teal-500 text-white group-hover:bg-teal-400",
    edge: "group-hover:border-teal-400/50",
  },
};

export function RoleCard({
  href,
  accent,
  eyebrow,
  title,
  description,
  bullets,
  cta,
  icon: Icon,
  delay = "0ms",
}: {
  href: string;
  accent: Accent;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  icon: LucideIcon;
  delay?: string;
}) {
  const styles = ACCENTS[accent];

  return (
    <Link
      href={href}
      style={{ animationDelay: delay }}
      className={cn(
        "group relative flex animate-rise flex-col overflow-hidden rounded-3xl border border-white/10 p-7 transition duration-300 sm:p-9",
        "glass-card hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/40",
        styles.edge,
      )}
    >
      {/* Corner glow that intensifies on hover */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl transition duration-500 group-hover:opacity-100",
          styles.glow,
        )}
      />

      <span className="relative flex items-center justify-between">
        <span
          className={cn(
            "grid size-14 place-items-center rounded-2xl text-white shadow-lg transition duration-300 group-hover:scale-105",
            styles.tile,
          )}
        >
          <Icon className="size-7" aria-hidden />
        </span>
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-[0.22em] sm:text-[11px]",
            styles.label,
          )}
        >
          {eyebrow}
        </span>
      </span>

      <h2 className="relative mt-6 font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-[28px]">
        {title}
      </h2>
      <p className="relative mt-2.5 text-sm leading-relaxed text-ink-300">{description}</p>

      <ul className="relative mt-6 space-y-2.5">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5 text-sm text-ink-200">
            <Check className={cn("mt-0.5 size-4 shrink-0", styles.bullet)} aria-hidden />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <span className="relative mt-8 flex items-center gap-3 pt-1">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
            styles.cta,
          )}
        >
          {cta}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>
      </span>
    </Link>
  );
}
