// Lightweight, fire-and-forget interaction logger.
// Posts to /api/log (Netlify function) and never blocks the UI.

const SESSION_KEY = "stylesift.sessionId";

function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        (crypto.randomUUID && crypto.randomUUID()) ||
        Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

export function logEvent(event: string, payload: Record<string, unknown> = {}): void {
  const body = JSON.stringify({
    event,
    payload,
    sessionId: getSessionId(),
    ts: Date.now(),
    path: typeof location !== "undefined" ? location.pathname : "/",
    ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/log", blob);
      return;
    }
  } catch {
    // fall through to fetch
  }

  // Best-effort; ignore network errors so the UI never feels them.
  fetch("/api/log", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
