import type { Handler, HandlerEvent } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";

function blobStore() {
  const siteID = process.env.NETLIFY_SITE_ID ?? process.env.SITE_ID ?? "";
  const token = process.env.NETLIFY_API_TOKEN ?? process.env.NETLIFY_AUTH_TOKEN ?? "";
  if (siteID && token) {
    return getStore({ name: "stylesift-events", siteID, token });
  }
  return getStore("stylesift-events");
}

interface LogPayload {
  event: string;
  payload?: Record<string, unknown>;
  sessionId?: string;
  ts?: number;
  path?: string;
  ua?: string;
}

const ALLOWED_EVENTS = new Set([
  "view",
  "path_chosen",
  "selection",
  "recommendation",
  "share_intent",
]);

const MAX_BODY_BYTES = 8 * 1024;

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const raw = event.body ?? "";
  if (raw.length > MAX_BODY_BYTES) {
    return { statusCode: 413, body: "Payload too large" };
  }

  let parsed: LogPayload;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  if (typeof parsed.event !== "string" || !ALLOWED_EVENTS.has(parsed.event)) {
    return { statusCode: 400, body: "Invalid event" };
  }

  const ip = clientIp(event);
  const ipHash = hashIp(ip);
  const ts = typeof parsed.ts === "number" ? parsed.ts : Date.now();

  const record = {
    ts,
    event: parsed.event,
    sessionId: typeof parsed.sessionId === "string" ? parsed.sessionId.slice(0, 64) : "anon",
    path: typeof parsed.path === "string" ? parsed.path.slice(0, 200) : "/",
    ua: typeof parsed.ua === "string" ? parsed.ua.slice(0, 256) : "",
    payload: sanitize(parsed.payload),
    ipHash,
    ipPrefix: ipPrefix(ip),
  };

  try {
    const store = blobStore();
    // One blob per event keeps writes cheap and readable.
    const key = `${ts}-${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(key, record);
  } catch (err: any) {
    // Outside Netlify (local dev without `netlify dev`) Blobs is unavailable —
    // log to stdout so the dev still has visibility, then succeed.
    console.log("[stylesift event]", JSON.stringify(record));
    console.error("Failed to persist event:", err?.message ?? err);
  }

  return {
    statusCode: 204,
    headers: { "cache-control": "no-store" },
    body: "",
  };
};

function clientIp(event: HandlerEvent): string {
  const headers = event.headers || {};
  const fwd =
    headers["x-nf-client-connection-ip"] ||
    headers["x-forwarded-for"] ||
    headers["client-ip"] ||
    "";
  if (typeof fwd === "string" && fwd.length > 0) {
    return fwd.split(",")[0].trim();
  }
  return "0.0.0.0";
}

// Hash the IP with a daily-rotating salt so we can group activity per visitor
// without storing the raw IP at rest.
function hashIp(ip: string): string {
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.STYLESIFT_IP_SALT || "stylesift-default-salt";
  return createHash("sha256").update(`${salt}|${day}|${ip}`).digest("hex").slice(0, 24);
}

// A coarse, non-identifying network prefix — useful for rough geo bucketing.
function ipPrefix(ip: string): string {
  if (ip.includes(":")) return ip.split(":").slice(0, 2).join(":") + "::/32";
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.0.0/16`;
  return "unknown";
}

function sanitize(p: unknown): Record<string, unknown> {
  if (!p || typeof p !== "object") return {};
  try {
    const json = JSON.stringify(p);
    if (json.length > 2048) return { _truncated: true };
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return {};
  }
}
