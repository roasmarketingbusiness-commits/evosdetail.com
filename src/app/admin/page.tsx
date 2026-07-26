import Link from "next/link";
import { getSql, type Lead } from "@/lib/db";

export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "active", label: "Active" },
  { key: "done", label: "Done" },
  { key: "paid", label: "Paid" },
  { key: "all", label: "All" },
] as const;
type FilterKey = (typeof FILTERS)[number]["key"];

const STATUS_STYLES: Record<Lead["status"], string> = {
  new: "text-volt border-volt/40",
  confirmed: "text-ink border-hairline-strong",
  done: "text-emerald-400 border-emerald-400/40",
  paid: "text-emerald-400 border-emerald-400/40",
  cancelled: "text-ink-mute border-hairline",
};

async function getLeads(filter: FilterKey): Promise<Lead[]> {
  const sql = getSql();
  switch (filter) {
    case "active":
      return (await sql`
        SELECT * FROM leads WHERE status IN ('new','confirmed')
        ORDER BY job_date ASC NULLS LAST, created_at DESC
      `) as Lead[];
    case "done":
      return (await sql`
        SELECT * FROM leads WHERE status = 'done'
        ORDER BY job_date ASC NULLS LAST, created_at DESC
      `) as Lead[];
    case "paid":
      return (await sql`
        SELECT * FROM leads WHERE status = 'paid' ORDER BY updated_at DESC
      `) as Lead[];
    default:
      return (await sql`SELECT * FROM leads ORDER BY created_at DESC`) as Lead[];
  }
}

function fmtDate(d: Date | null) {
  if (!d) return null;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ f?: string }>;
}) {
  const { f } = await searchParams;
  const filter: FilterKey = FILTERS.some((x) => x.key === f) ? (f as FilterKey) : "active";
  const leads = await getLeads(filter);

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {FILTERS.map((x) => (
          <Link
            key={x.key}
            href={x.key === "active" ? "/admin" : `/admin?f=${x.key}`}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              filter === x.key
                ? "border-volt text-volt"
                : "border-hairline text-ink-mute"
            }`}
          >
            {x.label}
          </Link>
        ))}
      </div>

      {leads.length === 0 ? (
        <p className="py-16 text-center text-ink-mute">
          {filter === "active"
            ? "No active jobs. New bookings show up here automatically."
            : "Nothing here yet."}
        </p>
      ) : (
        <ul className="space-y-3">
          {leads.map((lead) => (
            <li
              key={lead.id}
              className="rounded-2xl border border-hairline bg-paper-rise/50 p-4"
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="display text-lg">{lead.name || "No name"}</span>
                <span
                  className={`rounded-full border px-3 py-0.5 text-xs uppercase tracking-wide ${STATUS_STYLES[lead.status]}`}
                >
                  {lead.status}
                </span>
              </div>
              <div className="space-y-0.5 text-sm text-ink-soft">
                {(lead.package || lead.vehicle) && (
                  <p>
                    {[lead.package, lead.vehicle].filter(Boolean).join(" · ")}
                    {lead.quoted_price != null && (
                      <span className="text-volt"> — ${lead.quoted_price}</span>
                    )}
                  </p>
                )}
                {(lead.job_date || lead.time_window) && (
                  <p>{[fmtDate(lead.job_date), lead.time_window].filter(Boolean).join(" · ")}</p>
                )}
                {lead.address && <p>{lead.address}</p>}
                {lead.phone && (
                  <p>
                    <a href={`tel:${lead.phone}`} className="text-volt underline-offset-2 hover:underline">
                      {lead.phone}
                    </a>
                    {lead.source === "phone" && (
                      <span className="eyebrow ml-2 text-ink-mute">phone lead</span>
                    )}
                  </p>
                )}
                {lead.notes && <p className="text-ink-mute">“{lead.notes}”</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
