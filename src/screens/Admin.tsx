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

interface Flow {
  sessionId: string;
  ipHash: string;
  startedAt: number;
  endedAt: number;
  path?: "vibe" | "builder";
  recommended?: { name?: string; character?: string; tagline?: string };
  shared: boolean;
  completed: boolean;
  device: string;
  events: EventRecord[];
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
  const [filter, setFilter] = useState<"all" | "vibe" | "builder" | "completed" | "shared">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

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

  useEffect(() => { if (token) fetchEvents(token); }, []); // eslint-disable-line

  // Group events into flows (one row per user session)
  const flows = useMemo(() => groupIntoFlows(events), [events]);

  const filteredFlows = useMemo(() => {
    return flows.filter((f) => {
      if (filter === "all") return true;
      if (filter === "vibe") return f.path === "vibe";
      if (filter === "builder") return f.path === "builder";
      if (filter === "completed") return f.completed;
      if (filter === "shared") return f.shared;
      return true;
    });
  }, [flows, filter]);

  const stats = useMemo(() => {
    const completed = flows.filter((f) => f.completed).length;
    const shares = flows.filter((f) => f.shared).length;
    const vibe = flows.filter((f) => f.path === "vibe").length;
    const builder = flows.filter((f) => f.path === "builder").length;
    const visitors = new Set(flows.map((f) => f.ipHash)).size;
    const completionRate = flows.length > 0 ? Math.round((completed / flows.length) * 100) : 0;
    return { total: flows.length, completed, shares, vibe, builder, visitors, completionRate };
  }, [flows]);

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
            <button type="button" className="btn-primary !h-12 !px-6" onClick={() => fetchEvents(token)} disabled={!token || loading}>
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

      {/* Hero stats */}
      <section className="mt-4 rise rise-1">
        <div className="rounded-xl bg-gradient-to-br from-primary-tint to-surface-soft p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Total flows</p>
          <p className="font-display text-[44px] font-semibold leading-none text-ink mt-1">{stats.total}</p>
          <p className="mt-2 text-[13px] text-muted">
            {stats.visitors} unique visitors · {stats.completionRate}% completed
          </p>
        </div>
      </section>

      {/* Stat grid */}
      <section className="mt-3 grid grid-cols-2 gap-3 rise rise-2">
        <StatCard label="Vibe quiz" value={stats.vibe} sublabel={`${pct(stats.vibe, stats.total)}%`} accent />
        <StatCard label="Builder" value={stats.builder} sublabel={`${pct(stats.builder, stats.total)}%`} accent />
        <StatCard label="Reveals" value={stats.completed} sublabel="completed flows" />
        <StatCard label="Shares" value={stats.shares} sublabel={`${pct(stats.shares, stats.completed)}% of reveals`} />
      </section>

      {/* Top dresses */}
      <PopularDresses flows={flows} />

      {/* Filters */}
      <div className="mt-6 flex items-center justify-between rise rise-3">
        <p className="eyebrow">Recent flows</p>
        <button type="button" className="text-[13px] text-primary underline underline-offset-2" onClick={() => fetchEvents(token)}>
          Refresh
        </button>
      </div>
      <div className="scroll-x mt-3 rise rise-3">
        {(["all", "vibe", "builder", "completed", "shared"] as const).map((t) => (
          <button
            key={t}
            type="button"
            className={`pill whitespace-nowrap ${filter === t ? "pill-active" : ""}`}
            onClick={() => setFilter(t)}
          >
            {t === "all" ? `All (${flows.length})` : t}
          </button>
        ))}
      </div>

      {/* Flow list */}
      <div className="mt-4 flex-1 space-y-2 rise rise-4">
        {loading && <p className="body-sm text-muted">Loading…</p>}
        {!loading && filteredFlows.length === 0 && (
          <div className="rounded-lg border border-dashed border-hairline-soft py-12 text-center">
            <p className="body-sm text-muted">No flows match this filter.</p>
          </div>
        )}
        {filteredFlows.map((flow) => {
          const flowId = `${flow.sessionId}:${flow.startedAt}`;
          return (
            <FlowRow
              key={flowId}
              flow={flow}
              expanded={expanded === flowId}
              onToggle={() => setExpanded(expanded === flowId ? null : flowId)}
            />
          );
        })}
      </div>
    </main>
  );
}

// ─── Flow grouping ──────────────────────────────────────────
// One flow = one "try". Within a session we split into multiple tries:
// a try ends at a `recommendation`, and any later activity (path_chosen,
// selection, etc.) starts a new try. share_intent is attached to the
// most recent completed try.

function groupIntoFlows(events: EventRecord[]): Flow[] {
  const bySession = new Map<string, EventRecord[]>();
  for (const ev of events) {
    const arr = bySession.get(ev.sessionId);
    if (arr) arr.push(ev);
    else bySession.set(ev.sessionId, [ev]);
  }

  const flows: Flow[] = [];

  for (const [sessionId, sessionEvs] of bySession) {
    sessionEvs.sort((a, b) => a.ts - b.ts);

    // Split this session into one or more tries.
    let currentTry: EventRecord[] = [];
    const tries: EventRecord[][] = [];

    const startsNewTry = (ev: EventRecord) =>
      ev.event === "path_chosen" || ev.event === "selection";

    for (const ev of sessionEvs) {
      if (ev.event === "share_intent") {
        // attach share to the LAST try (most recent completed try)
        if (tries.length > 0) {
          tries[tries.length - 1].push(ev);
        } else {
          currentTry.push(ev);
        }
        continue;
      }

      // If we already have a completed try in `currentTry` and this new event
      // looks like the start of another try, close the current and start fresh.
      const currentHasReveal = currentTry.some((e) => e.event === "recommendation");
      if (currentHasReveal && startsNewTry(ev)) {
        tries.push(currentTry);
        currentTry = [];
      }

      currentTry.push(ev);

      if (ev.event === "recommendation") {
        // Don't close yet — wait to see if a share_intent follows.
        // We'll close when the next try starts (handled above) or at end of loop.
      }
    }
    if (currentTry.length > 0) tries.push(currentTry);

    // Build a Flow per try
    for (const evs of tries) {
      // Skip "tries" that are only page views (noise)
      const hasMeaningful = evs.some((e) => e.event !== "view");
      if (!hasMeaningful) continue;

      const startedAt = evs[0].ts;
      const endedAt = evs[evs.length - 1].ts;

      let path: "vibe" | "builder" | undefined;
      let recommended: Flow["recommended"];
      let shared = false;
      let completed = false;

      for (const ev of evs) {
        const p = ev.payload as any;
        if (ev.event === "path_chosen" && (p?.path === "vibe" || p?.path === "builder")) {
          path = p.path;
        }
        if (ev.event === "selection" && (p?.via === "vibe" || p?.via === "builder")) {
          path = p.via;
        }
        if (ev.event === "recommendation") {
          completed = true;
          if (p?.via === "vibe" || p?.via === "builder") path = p.via;
          if (p?.result) recommended = { name: p.result.name, character: p.result.character, tagline: p.result.tagline };
        }
        if (ev.event === "share_intent") shared = true;
      }

      flows.push({
        sessionId,
        ipHash: evs[0].ipHash,
        startedAt,
        endedAt,
        path,
        recommended,
        shared,
        completed,
        device: parseDevice(evs[0].ua),
        events: evs,
      });
    }
  }

  flows.sort((a, b) => b.startedAt - a.startedAt);
  return flows;
}

function parseDevice(ua: string): string {
  if (!ua) return "Unknown";
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) return "Android";
  if (/Mac/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Linux/i.test(ua)) return "Linux";
  return "Other";
}

function pct(a: number, b: number): number {
  return b > 0 ? Math.round((a / b) * 100) : 0;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function durationStr(start: number, end: number): string {
  const sec = Math.round((end - start) / 1000);
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

// ─── UI components ──────────────────────────────────────────

function StatCard({ label, value, sublabel, accent }: { label: string; value: number; sublabel?: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg p-3 ${accent ? "bg-primary-tint" : "bg-surface-soft"}`}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="font-display text-[26px] font-semibold leading-none text-ink mt-1">{value}</p>
      {sublabel && <p className="mt-1 text-[11px] text-muted">{sublabel}</p>}
    </div>
  );
}

function PopularDresses({ flows }: { flows: Flow[] }) {
  const top = useMemo(() => {
    const counts = new Map<string, { name: string; character: string; count: number }>();
    for (const f of flows) {
      const name = f.recommended?.name;
      if (!name) continue;
      const character = f.recommended?.character ?? "";
      const existing = counts.get(name);
      if (existing) existing.count++;
      else counts.set(name, { name, character, count: 1 });
    }
    return Array.from(counts.values()).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [flows]);

  if (top.length === 0) return null;

  return (
    <section className="mt-6 rise rise-2">
      <p className="eyebrow">Top dresses</p>
      <div className="mt-3 space-y-2">
        {top.map((d, i) => (
          <div key={d.name} className="flex items-center justify-between rounded-lg bg-surface-soft px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[12px] font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-[14px] font-medium text-ink">{d.name}</p>
                {d.character && <p className="text-[12px] text-muted">as {d.character}</p>}
              </div>
            </div>
            <span className="text-[14px] font-semibold text-primary">{d.count}×</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FlowRow({ flow, expanded, onToggle }: { flow: Flow; expanded: boolean; onToggle: () => void }) {
  const pathColor =
    flow.path === "vibe"      ? "bg-primary-soft text-primary"
    : flow.path === "builder" ? "bg-blue-50 text-blue-700"
    : "bg-surface-soft text-muted";

  return (
    <div className={`rounded-lg border bg-canvas transition-all ${expanded ? "border-ink shadow-soft" : "border-hairline-soft"}`}>
      <button type="button" onClick={onToggle} className="flex w-full items-start justify-between gap-3 p-4 text-left">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${pathColor}`}>
              {flow.path ?? "browsing"}
            </span>
            {flow.completed && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                ✓ revealed
              </span>
            )}
            {flow.shared && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                ↗ shared
              </span>
            )}
          </div>

          {flow.recommended ? (
            <div className="mt-2">
              <p className="font-display text-[16px] font-medium text-ink leading-tight">
                {flow.recommended.character ? <span className="italic text-primary">{flow.recommended.character}, </span> : null}
                <span>in {flow.recommended.name}</span>
              </p>
              {flow.recommended.tagline && (
                <p className="mt-0.5 text-[12px] italic text-muted line-clamp-1">"{flow.recommended.tagline}"</p>
              )}
            </div>
          ) : (
            <p className="mt-2 text-[13px] text-muted">No reveal — bounced after {flow.events.length} step{flow.events.length === 1 ? "" : "s"}</p>
          )}

          <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-soft flex-wrap">
            <span>{timeAgo(flow.startedAt)}</span>
            <span>·</span>
            <span>{durationStr(flow.startedAt, flow.endedAt)}</span>
            <span>·</span>
            <span>{flow.device}</span>
            <span>·</span>
            <span className="font-mono">{flow.ipHash.slice(0, 6)}</span>
          </div>
        </div>

        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`shrink-0 mt-1 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-hairline-soft bg-surface-soft/30 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">Journey</p>
          <ol className="space-y-1.5">
            {flow.events
              .filter((ev) => ev.event !== "view")
              .map((ev, i) => (
                <li key={i} className="flex items-start gap-3 text-[12px]">
                  <span className="shrink-0 text-muted-soft tabular-nums w-12">
                    {new Date(ev.ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                  <span className="shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <span className="text-ink">
                    <span className="font-medium">{prettyEvent(ev.event)}</span>
                    {summarizePayload(ev) && <span className="text-muted ml-1.5">— {summarizePayload(ev)}</span>}
                  </span>
                </li>
              ))}
            {flow.recommended && (() => {
              const recEv = flow.events.find((e) => e.event === "recommendation");
              const answers = (recEv?.payload as any)?.answers as Record<string, string> | undefined;
              if (!answers) return null;
              return (
                <li className="mt-3 ml-[60px] rounded-md bg-white border border-hairline-soft p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">Final answers</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(answers).map(([k, v]) => (
                      <span key={k} className="inline-flex items-center gap-1 rounded-full bg-primary-tint px-2 py-0.5 text-[11px]">
                        <span className="text-muted">{k}</span>
                        <span className="font-medium text-ink">{String(v)}</span>
                      </span>
                    ))}
                  </div>
                </li>
              );
            })()}
          </ol>
          {flow.events.filter((e) => e.event === "view").length > 0 && (
            <p className="mt-3 text-[10px] text-muted-soft">
              + {flow.events.filter((e) => e.event === "view").length} page view{flow.events.filter((e) => e.event === "view").length === 1 ? "" : "s"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function prettyEvent(name: string): string {
  switch (name) {
    case "view": return "Viewed page";
    case "path_chosen": return "Started";
    case "selection": return "Picked";
    case "recommendation": return "✨ Got the reveal";
    case "share_intent": return "Tapped share";
    default: return name;
  }
}

function summarizePayload(ev: EventRecord): string | null {
  const p = ev.payload as any;
  if (!p) return null;
  if (ev.event === "path_chosen") return p.path === "vibe" ? "the vibe quiz" : p.path === "builder" ? "the builder" : p.path ?? null;
  if (ev.event === "selection") {
    if (p.field && p.value) return `${p.field}: ${p.value}`;
    return null;
  }
  if (ev.event === "recommendation") {
    const parts: string[] = [];
    if (p.result?.character) parts.push(p.result.character);
    if (p.result?.name) parts.push(`“${p.result.name}”`);
    return parts.join(" in ") || null;
  }
  if (ev.event === "share_intent") return p.name ?? null;
  return null;
}
