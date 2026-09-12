import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react-v1";

import { PROGRAM } from "@/mentorship/data/program";

/**
 * The dark branded band that sits at the top of every screen, carrying the
 * ITF-NECA and Shamzbridge Consult marks. Logos sit on white chips because
 * both source files have white backgrounds.
 */
export function SiteHeader({ showBack = false }: { showBack?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link
              href="/"
              aria-label="Back to role selection"
              className="mr-1 grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-ink-200 transition hover:border-white/40 hover:text-white"
            >
              <ArrowLeft className="size-4" aria-hidden />
            </Link>
          )}

          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 place-items-center rounded-lg bg-white px-2 shadow-sm">
              <Image
                src="/brand/itf-neca.jpg"
                alt="ITF-NECA"
                width={600}
                height={300}
                priority
                className="h-5 w-auto sm:h-6"
              />
            </span>
            <span aria-hidden className="h-6 w-px bg-white/15" />
            <span className="grid size-9 place-items-center rounded-lg bg-white p-1 shadow-sm">
              <Image
                src="/brand/shamzbridge.jpg"
                alt="Shamzbridge Consult"
                width={200}
                height={200}
                priority
                className="size-7 rounded"
              />
            </span>
          </Link>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-400 sm:text-[11px]">
            {PROGRAM.name}
          </p>
          <p className="text-[11px] text-ink-300 sm:text-xs">Mentorship Feedback Channel</p>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink-950 px-4 py-6 text-center sm:px-6">
      <p className="text-xs text-ink-400">
        Sponsored by <span className="font-semibold text-ink-200">{PROGRAM.sponsor}</span>
        <span className="mx-2 text-ink-600">•</span>
        Facilitated by <span className="font-semibold text-ink-200">{PROGRAM.facilitator}</span>
      </p>
    </footer>
  );
}
