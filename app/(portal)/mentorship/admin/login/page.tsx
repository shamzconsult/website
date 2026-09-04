"use client";

import { Suspense, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, Lock, LogIn } from "lucide-react-v1";

import { SiteFooter, SiteHeader } from "@/mentorship/components/SiteHeader";
import { StatusMessage } from "@/mentorship/components/StatusMessage";
import { HOST_COMPANY } from "@/mentorship/data/program";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  /*
   * Middleware always supplies ?next=. The fallback drops "/login" off the
   * current path so it stays correct whether this page is being served at
   * /admin/login (the feedback subdomain) or /mentorship/admin/login (the
   * direct route used on localhost and preview URLs).
   */
  const next = params.get("next") || pathname.replace(/\/login$/, "");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setError(result?.message ?? "That did not work. Please try again.");
        setSubmitting(false);
        return;
      }

      router.replace(next);
      router.refresh();
    } catch {
      setError("We could not reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader showBack />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-ink-950 px-4 py-16">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="grid-texture absolute inset-0 opacity-60" />
          <div className="absolute -left-24 top-10 size-96 animate-float rounded-full bg-brand-600/20 blur-[110px]" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="glass-card rounded-3xl p-8 sm:p-10">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-400">
              <Lock className="size-5" aria-hidden />
            </span>

            <h1 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-bold text-white">
              Organiser sign in
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              For {HOST_COMPANY.name} only. Mentors and mentees do not need an account — they are
              recognised by name.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="username" className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-ink-500 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-ink-500 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" aria-hidden />
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogIn className="size-4" aria-hidden />
                    Sign in
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-5">
            <StatusMessage tone="info">
              Credentials are set with the ADMIN_USERNAME and ADMIN_PASSWORD environment variables.
              Change them before the site goes live.
            </StatusMessage>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
