import type { Handler, HandlerEvent } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

// Protect with a simple bearer token set in Netlify env vars.
// Set STYLESIFT_ADMIN_TOKEN in your Netlify site → Environment variables.
function authorized(event: HandlerEvent): boolean {
  const token = process.env.STYLESIFT_ADMIN_TOKEN;
  if (!token) return true; // no token configured → open (dev convenience)

  const auth = event.headers.authorization ?? "";
  if (auth === `Bearer ${token}`) return true;

  const query = event.queryStringParameters ?? {};
  return query.token === token;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!authorized(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized. Pass ?token=<STYLESIFT_ADMIN_TOKEN> or Authorization: Bearer <token>." }),
    };
  }

  try {
    const store = getStore("stylesift-events");

    let blobs: { key: string }[] = [];
    try {
      const listing = await store.list();
      blobs = listing.blobs ?? [];
    } catch (listErr: any) {
      // Store might not exist yet (no events logged) — return empty with debug info
      console.warn("Blob store list failed:", listErr?.message ?? listErr);
      return {
        statusCode: 200,
        headers: { "content-type": "application/json", "cache-control": "no-store" },
        body: JSON.stringify({
          count: 0,
          events: [],
          debug: {
            note: "Blob store may not exist yet — log some events first",
            error: listErr?.message ?? String(listErr),
            netlifyEnv: !!process.env.NETLIFY,
          },
        }),
      };
    }

    const events: unknown[] = [];
    const keys = blobs.map((b) => b.key).slice(-500);

    await Promise.all(
      keys.map(async (key) => {
        try {
          const data = await store.get(key, { type: "json" });
          if (data) events.push(data);
        } catch {
          // skip corrupt blobs
        }
      })
    );

    // Sort newest first
    events.sort((a: any, b: any) => (b.ts ?? 0) - (a.ts ?? 0));

    return {
      statusCode: 200,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
      body: JSON.stringify({ count: events.length, events }),
    };
  } catch (err: any) {
    console.error("Failed to read events:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to read events",
        detail: err?.message ?? String(err),
        stack: err?.stack?.split("\n").slice(0, 5),
      }),
    };
  }
};
