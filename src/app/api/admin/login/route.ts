import { NextResponse } from "next/server";
import { COOKIE_NAME, SESSION_DAYS, signSession } from "@/lib/auth";

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) {
    return NextResponse.json({ ok: false, reason: "unconfigured" }, { status: 503 });
  }

  const data = await request.json().catch(() => null);
  if (!data?.password || data.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, await signSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return res;
}
