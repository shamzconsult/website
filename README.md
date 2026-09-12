# Shamzbridge Consult Official Website
![image](https://github.com/user-attachments/assets/0090e900-8122-4259-9805-d4643ef38d51)

---

## Two sites, one app

This project serves both the marketing site and the mentorship feedback portal. They are
told apart by hostname, in `middleware.ts`:

| Hostname | Serves | Code |
|---|---|---|
| `shamzbridgeconsult.org`, `www.shamzbridgeconsult.org` | marketing site | `app/(site)/**` |
| `feedback.shamzbridgeconsult.org` | mentorship feedback portal | `app/(portal)/mentorship/**` |

Requests on the feedback subdomain are **rewritten** into the `/mentorship` namespace, so the
portal's root-relative links (`/mentor`, `/api/intake`) resolve without a visible prefix. Nothing
on the main domain changes, except `/mentorship/*`, which redirects to the subdomain so each
page has one public URL.

Each site has its own root layout, so they share no chrome, fonts or analytics. They also keep
separate Tailwind versions — the site is on v3, the portal on v4, which is what it was built
with. Portal-specific code lives in `mentorship/`; see `mentorship/README.md`.

### The portal's stylesheet is a build step

Next runs one PostCSS pipeline, so both Tailwinds cannot go through it. Instead
`app/(portal)/portal.tailwind.css` is compiled by the v4 CLI into `app/(portal)/portal.css`,
which is what the portal's layout imports:

```bash
npm run portal:css          # once
npm run portal:css:watch    # while working on the portal
```

`npm run dev` and `npm run build` run it automatically. If you edit portal markup without one of
those running, new Tailwind classes will not appear until you rebuild it.

### Running it locally

```bash
npm run dev
```

- Marketing site: <http://localhost:3000>
- Feedback portal: <http://feedback.localhost:3000>

Browsers resolve any `*.localhost` name to the loopback address, so the second URL needs no
hosts file entry.

### Deploying

`feedback.shamzbridgeconsult.org` must be added as a domain on **this same** Vercel/host project
— the routing is done in the app, not by a separate deployment. The DNS record for it should
point wherever `shamzbridgeconsult.org` already points.

The portal needs its own environment variables (SMTP, Neon, Cloudinary, organiser login).
`mentorship/env.example` documents every one of them.

Two optional variables tune the routing itself:

| Variable | Default |
|---|---|
| `NEXT_PUBLIC_PORTAL_HOST` | `feedback.shamzbridgeconsult.org` |
| `NEXT_PUBLIC_MAIN_HOSTS` | `shamzbridgeconsult.org,www.shamzbridgeconsult.org` |
