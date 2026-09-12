"use client";

import { CircleAlert, Info } from "lucide-react-v1";

import { cn } from "@/mentorship/lib/utils";

type Tone = "error" | "warning" | "info";

const TONES: Record<Tone, { wrap: string; icon: string }> = {
  error: { wrap: "border-red-200 bg-red-50 text-red-800", icon: "text-red-500" },
  warning: { wrap: "border-amber-200 bg-amber-50 text-amber-900", icon: "text-amber-500" },
  info: { wrap: "border-ink-200 bg-ink-50 text-ink-700", icon: "text-ink-400" },
};

export function StatusMessage({
  tone = "error",
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: React.ReactNode;
}) {
  const styles = TONES[tone];
  const Icon = tone === "info" ? Info : CircleAlert;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-xl border p-4 text-sm", styles.wrap)}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", styles.icon)} aria-hidden />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        <div className={cn(title && "mt-1", "leading-relaxed")}>{children}</div>
      </div>
    </div>
  );
}
