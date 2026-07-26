import { neon } from "@neondatabase/serverless";

// Lazy so builds without DATABASE_URL (e.g. CI) don't crash at import time.
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export const LEAD_STATUSES = [
  "new",
  "confirmed",
  "done",
  "paid",
  "cancelled",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type Lead = {
  id: number;
  source: "booking" | "phone";
  status: LeadStatus;
  name: string;
  phone: string;
  address: string;
  package: string;
  vehicle: string;
  condition: string;
  job_date: Date | null; // date column — the neon driver parses it to a Date
  time_window: string;
  notes: string;
  quoted_price: number | null;
  final_price: number | null;
  created_at: string;
  updated_at: string;
};
