import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

// Captures each booking into the CRM (leads table) so it shows up at /admin.
// Fired best-effort from the client after FormSubmit succeeds — the email
// stays the system of record, so a failure here never blocks a booking.

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, reason: "unconfigured" }, { status: 503 });
  }

  const data = await request.json().catch(() => null);
  if (!data) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // honeypot field filled = bot, pretend success
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const jobDate = /^\d{4}-\d{2}-\d{2}$/.test(str(data.date)) ? str(data.date) : null;
  const quotedPrice = Number.isFinite(data.finalPrice) ? Math.round(data.finalPrice) : null;

  try {
    const sql = getSql();
    await sql`
      INSERT INTO leads (source, name, phone, address, package, vehicle, condition,
                         job_date, time_window, notes, quoted_price)
      VALUES ('booking', ${str(data.name)}, ${str(data.phone)}, ${str(data.address)},
              ${str(data.package)}, ${str(data.vehicle)}, ${str(data.condition)},
              ${jobDate}, ${str(data.timeWindow)}, ${str(data.notes)}, ${quotedPrice})
    `;
  } catch (err) {
    console.error("CRM capture failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
