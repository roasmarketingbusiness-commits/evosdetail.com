// One-time (idempotent) schema setup for the CRM leads table.
// Run: node --env-file=.env.local scripts/migrate.mjs
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set — run `vercel env pull .env.local` first.");
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS leads (
    id           serial PRIMARY KEY,
    source       text NOT NULL DEFAULT 'booking' CHECK (source IN ('booking','phone')),
    status       text NOT NULL DEFAULT 'new' CHECK (status IN ('new','confirmed','done','paid','cancelled')),
    name         text NOT NULL DEFAULT '',
    phone        text NOT NULL DEFAULT '',
    address      text NOT NULL DEFAULT '',
    package      text NOT NULL DEFAULT '',
    vehicle      text NOT NULL DEFAULT '',
    condition    text NOT NULL DEFAULT '',
    job_date     date,
    time_window  text NOT NULL DEFAULT '',
    notes        text NOT NULL DEFAULT '',
    quoted_price integer,
    final_price  integer,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
  )
`;
await sql`CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status)`;
await sql`CREATE INDEX IF NOT EXISTS leads_job_date_idx ON leads (job_date)`;

const [{ count }] = await sql`SELECT count(*)::int AS count FROM leads`;
console.log(`done — leads table ready (${count} rows)`);
