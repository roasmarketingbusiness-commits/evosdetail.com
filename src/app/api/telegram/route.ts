import { NextResponse } from "next/server";

// Pushes new booking requests to the EVOS Telegram chat so Austin
// sees incoming work immediately. Configure in Vercel env:
//   TELEGRAM_BOT_TOKEN — from @BotFather
//   TELEGRAM_CHAT_ID   — the chat/group the bot posts into
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
  if (!TOKEN || !CHAT_ID) {
    // Not configured yet — report cleanly so the client can ignore it
    return NextResponse.json({ ok: false, reason: "unconfigured" }, { status: 503 });
  }

  const data = await request.json();

  // honeypot field filled = bot, pretend success
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const lines = [
    "🚗 New booking request — EVOS Detail",
    "",
    `Package: ${data.package}`,
    `Vehicle: ${data.vehicle}`,
    `Condition: ${data.condition || "—"}`,
    `Day: ${data.date} — ${data.timeWindow}`,
    `Address: ${data.address}`,
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Notes: ${data.notes || "—"}`,
    "",
    "Confirm the slot by text 👆",
  ];

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text: lines.join("\n") }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.ok) {
    console.error("Telegram push failed:", res.status, body);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
