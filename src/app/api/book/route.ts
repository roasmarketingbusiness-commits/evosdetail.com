import { NextResponse } from "next/server";

// Booking requests are delivered by email via FormSubmit (free, no account).
// Swap LEAD_EMAIL when EVOS gets its own inbox.
const LEAD_EMAIL = process.env.LEAD_EMAIL ?? "elyandjackyrocks@gmail.com";
const SITE_URL = "https://evosdetail.com";

export async function POST(request: Request) {
  const data = await request.json();

  // honeypot field filled = bot, pretend success
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const res = await fetch(`https://formsubmit.co/ajax/${LEAD_EMAIL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // FormSubmit rejects requests without a browser-style origin
      Origin: SITE_URL,
      Referer: `${SITE_URL}/`,
    },
    body: JSON.stringify({
      _subject: `EVOS booking: ${data.package} — ${data.name}`,
      _template: "table",
      name: data.name,
      phone: data.phone,
      zip: data.zip,
      package: data.package,
      vehicle: data.vehicle,
      preferred_day: data.date,
      time_window: data.timeWindow,
      notes: data.notes || "—",
    }),
  });

  // FormSubmit returns HTTP 200 even on refusal — the body carries the truth
  const body = await res.json().catch(() => null);
  const delivered = res.ok && body && String(body.success) === "true";

  if (!delivered) {
    console.error("FormSubmit refused booking delivery:", res.status, body);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
