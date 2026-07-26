// Minimal cookie sessions for /admin: value is "<expiryMs>.<hmac>" signed
// with SESSION_SECRET. Web Crypto only, so it runs in proxy + node runtimes.

export const COOKIE_NAME = "evos_admin";
export const SESSION_DAYS = 180;

async function hmac(payload: string): Promise<string> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signSession(): Promise<string> {
  const exp = String(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  return `${exp}.${await hmac(exp)}`;
}

export async function verifySession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const [exp, sig] = cookieValue.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  try {
    return (await hmac(exp)) === sig;
  } catch {
    return false;
  }
}
