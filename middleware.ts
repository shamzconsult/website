import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_COOKIE, isValidSessionToken } from "@/mentorship/lib/admin-auth";

const PORTAL_PREFIX = "/mentorship";

/** The public hostname for the portal. */
const PORTAL_HOST =
  process.env.NEXT_PUBLIC_PORTAL_HOST || "feedback.shamzbridgeconsult.org";

/** The production hostnames of the marketing site. */
const MAIN_HOSTS = new Set(
  (
    process.env.NEXT_PUBLIC_MAIN_HOSTS ||
    "shamzbridgeconsult.org,www.shamzbridgeconsult.org"
  )
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean),
);

/** Portal pages behind the organiser login. /admin/login is deliberately out. */
const ADMIN_GATE = [`${PORTAL_PREFIX}/admin`];

function hostname(request: NextRequest) {
  return (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
}

function isPortalHost(request: NextRequest) {
  const host = hostname(request);
  return host === PORTAL_HOST || host.startsWith("feedback.");
}

function isUnder(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/**
 * The optimistic session check in front of the organiser dashboard. Every
 * /api/admin route re-verifies the cookie for itself — middleware runs before
 * any data is touched and should not be the sole gate on it.
 *
 * @param internalPath the path as it exists inside app/, i.e. /mentorship/...
 * @param publicPath   the path as the visitor sees it, for the login redirect
 */
async function adminGate(
  request: NextRequest,
  internalPath: string,
  publicPath: string,
) {
  const gated = ADMIN_GATE.some((prefix) => isUnder(internalPath, prefix));
  if (!gated) return null;
  if (internalPath.startsWith(`${PORTAL_PREFIX}/admin/login`)) return null;

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (await isValidSessionToken(token)) return null;

  const login = request.nextUrl.clone();
  login.pathname = publicPath.startsWith(PORTAL_PREFIX)
    ? `${PORTAL_PREFIX}/admin/login`
    : "/admin/login";
  login.search = "";
  login.searchParams.set("next", publicPath);
  return NextResponse.redirect(login);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* ---- The feedback subdomain ------------------------------------------ */
  if (isPortalHost(request)) {
    // The /mentorship prefix is an implementation detail here. If someone
    // reaches it on this host, send them to the clean equivalent so the portal
    // never has two URLs for the same page.
    if (isUnder(pathname, PORTAL_PREFIX)) {
      const clean = request.nextUrl.clone();
      clean.pathname = pathname.slice(PORTAL_PREFIX.length) || "/";
      return NextResponse.redirect(clean);
    }

    const internalPath =
      pathname === "/" ? PORTAL_PREFIX : `${PORTAL_PREFIX}${pathname}`;

    const blocked = await adminGate(request, internalPath, pathname);
    if (blocked) return blocked;

    const target = request.nextUrl.clone();
    target.pathname = internalPath;
    return NextResponse.rewrite(target);
  }

  /* ---- Every other host: the marketing site ----------------------------- */
  if (isUnder(pathname, PORTAL_PREFIX)) {
    // In production the portal has a canonical home, so point at it.
    if (MAIN_HOSTS.has(hostname(request))) {
      const canonical = new URL(request.nextUrl.toString());
      canonical.protocol = "https:";
      // Assigning `host` would keep whatever port the request carried, and the
      // portal is only ever served on the default one.
      canonical.hostname = PORTAL_HOST;
      canonical.port = "";
      canonical.pathname = pathname.slice(PORTAL_PREFIX.length) || "/";
      return NextResponse.redirect(canonical, 308);
    }

    // Anywhere else — localhost, a Vercel preview URL — there is no working
    // feedback subdomain to send anyone to, so serve the portal in place.
    const blocked = await adminGate(request, pathname, pathname);
    if (blocked) return blocked;
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    const referer = request.headers.get("referer");
    if (referer) {
      try {
        if (isUnder(new URL(referer).pathname, PORTAL_PREFIX)) {
          const target = request.nextUrl.clone();
          target.pathname = `${PORTAL_PREFIX}${pathname}`;
          return NextResponse.rewrite(target);
        }
      } catch {
        // A malformed Referer is not worth failing the request over.
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/webpack-hmr|.*\\.[^/]+$).*)"],
};
