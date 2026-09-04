# Mentors Feedback Channel

The mentorship workflow for the **Data Analysis Bootcamp** — sponsored by ITF-NECA, facilitated
by Shamzbridge Consult.

Mentors and mentees never sign in: they pick their name from a roster. The only account in the
app belongs to the organiser, who gets a dashboard of who has submitted what.

---

## Getting started

```bash
npm install
cp mentorship/env.example .env.local   # then fill it in — see below
npm run dev
```

Open <http://feedback.localhost:3000> — **not** `localhost:3000`, which serves the marketing
site. Browsers resolve any `*.localhost` name to the loopback address, so this needs no hosts
file entry, and it exercises the same host-based routing production uses.

---

## Where this lives

The portal shares the Shamzbridge website's Next app and is told apart by hostname:

| | |
|---|---|
| `shamzbridgeconsult.org` | the marketing site — `app/(site)/**` |
| `feedback.shamzbridgeconsult.org` | this portal — `app/(portal)/mentorship/**` |

`middleware.ts` rewrites every request on the feedback subdomain into the `/mentorship`
namespace, so the portal's links stay root-relative (`/mentor`, `/api/intake`) and visitors
never see the prefix. Shared code — components, lib, roster — lives in `mentorship/`.

Styling is isolated too. The portal stays on Tailwind v4 while the site is on v3, so its
stylesheet is compiled separately rather than by Next's PostCSS pipeline:

```bash
npm run portal:css          # once
npm run portal:css:watch    # while working on the portal
```

`app/(portal)/portal.tailwind.css` is the source — the portal's original `globals.css`, with only
the import line and an `@source` block changed. It compiles to `app/(portal)/portal.css`, which
the layout imports. `npm run dev` and `npm run build` run the step for you.

---

## The one file you edit: `mentorship/data/roster.json`

Mentors, mentees and the host company all live in that JSON file. Add or remove entries freely —
every dropdown, route, email and dashboard figure follows automatically.

```jsonc
{
  "hostCompany": { "name": "Shamzbridge Consult", "email": "shamzbridgeconsult@gmail.com" },
  "program":     { "name": "…", "sponsor": "ITF-NECA", "cadence": "Monthly",
                   "months": ["2026-08", "2026-09", "2026-10", "2026-11"] },
  "mentors":     [{ "name": "…", "email": "…", "phone": "…", "groupId": 1 }],
  "mentees":     [{ "name": "…", "email": "…", "gender": "…", "groupId": 1 }]
}
```

Two things to fill in before launch:

1. **Mentor email addresses.** A mentor with an empty email cannot receive mentee messages, and
   the app says so rather than failing silently.
2. **`groupId` on every mentee.** `null` means unassigned; those mentees cannot send messages or
   complete a final evaluation, and the dashboard flags them.

`program.months` is the list of monthly cycles the dashboard tracks — one column per month.

The question wording for every form lives in `mentorship/data/forms.ts`, one array per form.

---

## What each person does

| Route | Who | When | Goes to |
|---|---|---|---|
| `/mentee/intake` | Mentee | **Once**, before the mentorship starts | Organiser + their mentor |
| `/mentor/intake` | Mentor | **Once**, before the mentorship starts | Organiser |
| `/mentee` | Mentee | Any time | Their mentor, copy to organiser |
| `/mentor` | Mentor | Every month | Organiser only, as one compiled email |
| `/call-log` | Either | After a call | Organiser, copy to the other party |
| `/mentee/final-evaluation` | Mentee | **Once**, at the end | Organiser |
| `/mentor/final-evaluation` | Mentor | **Once**, at the end | Organiser, all mentees in one email |
| `/admin` | Organiser | Any time | — (password protected) |

The "once" forms are enforced by a unique constraint in the database, and the form checks before
letting anyone start typing.

---

## Environment

Every piece is optional on its own, and the app degrades honestly without each one. A form is only
refused outright when there is neither a mailbox nor a database — that is, nowhere at all for the
entry to go.

| Variable | What breaks without it |
|---|---|
| `SMTP_USER`, `SMTP_PASS` | Entries are still recorded; the success screen says the email copy did not go out. |
| `DATABASE_URL` | Emails still go out; nothing is recorded and the dashboard says so. |
| `BREVO_API_KEY`, `MAIL_FROM_ADDRESS` | Optional. Without them delivery is SMTP only. |
| `CLOUDINARY_*` | Uploads fall back to email attachments (Gmail caps around 25 MB). |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SECRET` | Falls back to the defaults in `mentorship/lib/admin-auth.ts`. **Set these before going live.** |

`SMTP_PASS` is a Google **App Password**, not the account password — see `env.example` for how
to generate one.

### If mail fails in production

Submissions are written to the database *before* they are emailed, so a mail outage never costs
anyone their entry — the form says "saved, but not emailed" and the organiser can still see it in
`/admin`.

For delivery itself, SMTP is tried on the configured port and then on the other standard port (587
STARTTLS and 465 implicit TLS), because a blocked port is indistinguishable from a dead server.

Some hosting platforms block outbound SMTP on **every** port, which shows up as a connection
timeout to `smtp.gmail.com` no matter what is configured. The fix there is HTTPS delivery, over
Brevo:

1. Create a Brevo account at <https://www.brevo.com>.
2. Add the sending address under **Senders** (<https://app.brevo.com/senders>) and click the
   confirmation link Brevo emails to it. A Gmail address is fine — Brevo confirms a single
   *address*, not a whole domain, which is the whole reason it is used here.
3. Create an API key under **SMTP & API → API keys**.
4. Set `BREVO_API_KEY` and `MAIL_FROM_ADDRESS` (the address confirmed in step 2).
5. Redeploy. Brevo is used first, with SMTP kept as a fallback when it is also configured.

`MAIL_FROM_ADDRESS` must be a confirmed sender or every send is refused. `/admin` checks exactly
that on load — it reports an unknown or unconfirmed sender by name, so there is no need to submit
a form to find out.

> Set the variables in the hosting platform's dashboard as well. `.env` is not committed, so a
> local-only value looks configured on your machine and missing in production.

---

## Data

Neon Postgres, via `@neondatabase/serverless`. The schema in `mentorship/lib/db.ts` is created
automatically on first use and every statement is idempotent, so there is no migration step.

| Table | Holds |
|---|---|
| `mentee_intake`, `mentor_intake` | The one-off interest & expectations forms |
| `mentee_messages` | Questions and comments sent to mentors |
| `mentor_reports` | Monthly reports, with per-mentee answers as JSON |
| `call_logs` | Date, mode and note for every logged call |
| `mentee_final_evaluations`, `mentor_final_evaluations` | The section 6.0 Likert sheets |

A failed database write never fails a submission: delivery by email is the promise made to the
person filling the form, and the record is the organiser's copy of it. Failures are logged.

---

## Uploads

Files go to Cloudinary under `mentors-feedback-channel/<form>/…` and recipients get links.
Limits (`mentorship/lib/upload-limits.ts`) are enforced in the browser and again on the server: 8 files,
10 MB each, and a fixed list of document/image extensions.

---

## Organiser dashboard — `/admin`

Sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`. The session is a signed, HTTP-only cookie
valid for eight hours; `middleware.ts` redirects unauthenticated page requests and every
`/api/admin/*` route re-checks for itself.

The dashboard shows configuration health, headline counts, completion rates for mentors and
mentees side by side across intake / monthly / final, a per-month submission grid for both
tables, and open/export links for every dataset.

Exports: `/api/admin/export?dataset=<key>&format=csv|json`, plus `&id=<row>` for a single
response. Likert answers and intake answers are flattened into one column per question so the
CSV opens cleanly in a spreadsheet.

---

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
