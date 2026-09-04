/* ============================================================================
 * ADMIN (ORGANISER) AUTHENTICATION
 * ============================================================================
 * The organiser dashboard is the only part of the app behind a login —
 * mentors and mentees never sign in. Credentials are hardcoded below and can
 * be overridden by environment variables on the deployed site.
 *
 *   ADMIN_USERNAME / ADMIN_PASSWORD   the login
 *   ADMIN_SECRET                      signs the session cookie
 *
 * The session cookie carries an expiry and an HMAC over it, so it cannot be
 * forged or extended without the secret. Signing uses Web Crypto, which works
 * in the proxy (edge) runtime as well as in route handlers.
 * ==========================================================================*/

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "shamzbridge";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Shamzbridge@2026";

const SECRET = process.env.ADMIN_SECRET || `${ADMIN_USERNAME}:${ADMIN_PASSWORD}:mfc-session-v1`;

export const ADMIN_COOKIE = "mfc_admin";

/** Eight hours — long enough for a working day of reviewing submissions. */
export const SESSION_SECONDS = 8 * 60 * 60;

const encoder = new TextEncoder();

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Length-constant comparison, so a wrong password leaks no timing signal. */
function equal(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function checkCredentials(username: string, password: string) {
  return equal(username.trim(), ADMIN_USERNAME) && equal(password, ADMIN_PASSWORD);
}

/** Mints a session token valid for SESSION_SECONDS from now. */
export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_SECONDS * 1000;
  return `${expiresAt}.${await sign(String(expiresAt))}`;
}

export async function isValidSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  const separator = token.lastIndexOf(".");
  if (separator === -1) return false;

  const expiresAt = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) < Date.now()) return false;

  return equal(signature, await sign(expiresAt));
}
