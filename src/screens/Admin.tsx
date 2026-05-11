import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "./_chrome";

interface EventRecord {
  ts: number;
  event: string;
  sessionId: string;
  path: string;
  ua: string;
  ipHash: string;
  ipPrefix: string;
  payload: Record<string, unknown>;
}

interface AdminProps {
  onBack: () => void;
}

export function Admin({ onBack }: AdminProps) {
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem("stylesift.admin_token") ?? ""; } catch { return ""; }
  });
  const [authed, setAuthed] = useState(false);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const fetchEvents = useCallback(async (t: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events?token=${encodeURIComponent(t)}`);
      if (res.status === 401) { setError("Invalid token."); setAuthed(false); return; }
      if (!res.ok) { setError(`Server error ${res.status}`); return; }
      const data = await res.json();
      setEvents(data.events ?? []);
      setAuthed(true);
      try { localStorage.setItem("stylesift.admin_token", t); } catch {}
    } catch {
      setError("Network error — is the site deployed?");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch if token is saved
  useEffect(() => {
    if (token) fetchEvents(token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((e) => e.event === filter);
  }, [events, filter]);

  const eventTypes = useMemo(() => {
    const set = new Set(events.map((e) => e.event));
    return ["all", ...Array.from(set).sort()];
  }, [events]);

  const stats = useMemo(() => {
    const sessions = new Set(events.map((e) => e.sessionId));
    const visitors = new Set(events.map((e) => e.ipHash));
    const vibeCount = events.filter((e) => e.event === "recommendation" && (e.payload as any)?.via === "vibe").length;
    const builderCount = events.filter((e) => e.event === "recommendation" && (e.payload as any)?.via === "builder").length;
    const shares = events.filter((e) => e.event === "share_intent").length;
    return { total: events.length, sessions: sessions.size, visitors: visitors.size, vibeCount, builderCount, shares };
  }, [events]);

  if (!authed) {
    return (
      <main className="flex flex-1 flex-col px-5 pb-6">
        <Header onBack={onBack} title="Admin" />
        <section className="mt-8 rise rise-1">
          <h1 className="display-h2">Dashboard access</h1>
          <p className="body-sm mt-2 text-muted">
            Enter your <code className="rounded bg-surface-soft px-1.5 py-0.5 text-[13px]">STYLESIFT_ADMIN_TOKEN</code> to view interaction data.
          </p>
          <div className="mt-6 flex gap-3">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Admin token"
              className="h-12 flex-1 rounded-sm border border-hairline bg-canvas px-4 text-[15px] text-ink outline-none transition-colors focus:border-ink"
              onKeyDown={(e) => e.key === "Enter" && token && fetchEvents(token)}
            />
            <button
              type="button"
              className="btn-primary !h-12 !px-6"
              onClick={() => fetchEvents(token)}
              disabled={!token || loading}
            >
              {loading ? "…" : "Go"}
            </button>
          </div>
          {error && <p className="mt-3 text-[14px] text-red-600">{error}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-5 pb-6">
      <Header onBack={onBack} title="Dashboard" />

      {/* Stats bar */}
      <section className="mt-4 grid grid-cols-3 gap-3 rise rise-1">
        <StatCard label="Visitors" value={stats.visitors} />
        <StatCard label="Sessions" value={stats.sessions} />
        <StatCard label="Events" value={stats.total} />
      </section>

      <section className="mt-4 grid grid-cols-3 gap-3 rise rise-2">
        <StatCard label="Vibe picks" value={stats.vibeCount} accent />
        <StatCard label="Builder picks" value={stats.builderCount} accent />
        <StatCard label="Shares" value={stats.shares} accent />
      </section>

      {/* Popular results */}
      <PopularDresses events={events} />

      {/* Filter bar */}
      <div className="mt-6 rise rise-3">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Event log</p>
          <button
            type="button"
            className="text-[13px] text-primary underline underline-offset-2"
            onClick={() => fetchEvents(token)}
          >
            Refresh
          </button>
        </div>
        <div className="scroll-x mt-3">
          {eventTypes.map((t) => (
            <button
              key={t}
              type="button"
              className={`pill whitespace-nowrap ${filter === t ? "pill-active" : ""}`}
              onClick={() => setFilter(t)}
            >
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Event list */}
      <div className="mt-4 flex-1 space-y-2 rise rise-4">
        {loading && <p className="body-sm text-muted">Loading…</p>}
        {!loading && filtered.length === 0 && (
          <p className="body-sm text-muted">No events yet.</p>
        )}
        {filtered.map((ev, i) => (
          <EventRow key={`${ev.ts}-${i}`} event={ev} />
        ))}
      </div>
    </main>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-md p-3 ${accent ? "bg-primary-tint" : "bg-surface-soft"}`}>
      <p className="text-[24px] font-semibold leading-none text-ink font-display">{value}</p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}

function PopularDresses({ events }: { events: EventRecord[] }) {
  const top = useMemo(() => {
    const counts = new Map<string, { name: string; character: string; count: number }>();
    for (const ev of events) {
      if (ev.event !== "recommendation") continue;
      const p = ev.payload as any;
      const name = p?.result?.name;
      const character = p?.result?.character ?? "";
      if (!name) continue;
      const existing = counts.get(name);
      if (existing) existing.count++;
      else counts.set(name, { name, character, count: 1 });
    }
    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [events]);

  if (top.length === 0) return null;

  return (
    <section className="mt-6 rise rise-2">
      <p className="eyebrow">Top dresses</p>
      <div className="mt-3 space-y-2">
        {top.map((d, i) => (
          <div
            key={d.name}
            className="flex items-center justify-between rounded-sm bg-surface-soft px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[12px] font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-[14px] font-medium text-ink">{d.name}</p>
                {d.character && (
                  <p className="text-[12px] text-muted">as {d.character}</p>
                )}
              </div>
            </div>
            <span className="text-[14px] font-semibold text-primary">{d.count}×</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function EventRow({ event: ev }: { event: EventRecord }) {
  const [open, setOpen] = useState(false);
  const time = new Date(ev.ts);
  const badge = EVENT_BADGES[ev.event] ?? { bg: "bg-surface-soft", text: "text-ink" };

  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className="w-full rounded-sm border border-hairline-soft bg-canvas p-3 text-left transition-colors active:bg-surface-soft"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.bg} ${badge.text}`}>
            {ev.event}
          </span>
          <span className="truncate text-[13px] text-muted">
            {ev.sessionId.slice(0, 8)}
          </span>
        </div>
        <span className="shrink-0 text-[12px] text-muted-soft tabular-nums">
          {time.toLocaleDateString(undefined, { month: "short", day: "numeric" })}{" "}
          {time.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      {open && (
        <div className="mt-3 space-y-1.5 border-t border-hairline-soft pt-3">
          <Detail label="Session" value={ev.sessionId} />
          <Detail label="IP hash" value={ev.ipHash} />
          <Detail label="IP prefix" value={ev.ipPrefix} />
          <Detail label="Path" value={ev.path} />
          <Detail label="UA" value={ev.ua} truncate />
          {Object.keys(ev.payload).length > 0 && (
            <div className="mt-2">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted">Payload</p>
              <pre className="mt-1 overflow-x-auto rounded bg-surface-soft p-2 text-[12px] leading-relaxed text-ink">
                {JSON.stringify(ev.payload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </button>
  );
}

function Detail({ label, value, truncate }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div className="flex gap-2 text-[13px]">
      <span className="shrink-0 text-muted">{label}</span>
      <span className={`text-ink ${truncate ? "truncate" : ""}`}>{value}</span>
    </div>
  );
}

const EVENT_BADGES: Record<string, { bg: string; text: string }> = {
  view:           { bg: "bg-surface-strong", text: "text-ink" },
  path_chosen:    { bg: "bg-blue-50",        text: "text-blue-700" },
  recommendation: { bg: "bg-primary-soft",   text: "text-primary" },
  share_intent:   { bg: "bg-emerald-50",     text: "text-emerald-700" },
};
