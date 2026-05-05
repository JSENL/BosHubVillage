#!/usr/bin/env node
/**
 * Smoke test: invoke `send-content-alerts` and ensure the handler responds.
 *
 * Required env:
 *   SUPABASE_URL              — project URL (e.g. https://xxx.supabase.co)
 *   SUPABASE_ANON_KEY         — or VITE_SUPABASE_PUBLISHABLE_KEY (apikey header)
 *
 * Optional:
 *   SMOKE_ACCESS_TOKEN        — user JWT (e.g. from browser session). If set, used as Bearer
 *                              so you can test 200/404 as an admin. Without it, only the
 *                              anon key is sent — expect 401 (auth required).
 *   SMOKE_CONTENT_ALERT_ITEM_TYPE — default "event"
 *   SMOKE_CONTENT_ALERT_ITEM_ID
 *
 * Success:
 *   - 200 / 404 with admin token
 *   - 401 with anon key only (proves admin gate is enforced)
 *   - 403 with non-admin user token
 *
 * Usage:
 *   export SUPABASE_URL=... SUPABASE_ANON_KEY=...
 *   npm run smoke:content-alerts
 */

const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const apiKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const userJwt = process.env.SMOKE_ACCESS_TOKEN?.trim();
const bearer = userJwt || apiKey;

const itemType = process.env.SMOKE_CONTENT_ALERT_ITEM_TYPE || "event";
const itemId =
  process.env.SMOKE_CONTENT_ALERT_ITEM_ID || "00000000-0000-0000-0000-000000000001";

if (!baseUrl || !apiKey) {
  console.error(
    "smoke-send-content-alerts: set SUPABASE_URL and SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY / SUPABASE_SERVICE_ROLE_KEY for apikey).",
  );
  process.exit(1);
}

if (!bearer) {
  console.error("smoke-send-content-alerts: no Bearer token (set SMOKE_ACCESS_TOKEN or api key).");
  process.exit(1);
}

const endpoint = `${baseUrl}/functions/v1/send-content-alerts`;

const res = await fetch(endpoint, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${bearer}`,
    apikey: apiKey,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ itemType, itemId }),
});

const raw = await res.text();
let body;
try {
  body = JSON.parse(raw);
} catch {
  body = { _parseError: true, raw };
}

console.log("POST", endpoint);
console.log("Status:", res.status);
console.log("Body:", JSON.stringify(body, null, 2));

if (res.ok && res.status === 200) {
  console.log("Smoke OK (200 — edge function executed).");
  process.exit(0);
}

if (res.status === 404 && body?.error === "Item not found") {
  console.log("Smoke OK (404 — item id not in DB; handler and lookup ran).");
  process.exit(0);
}

if (res.status === 401) {
  console.log(
    "Smoke OK (401 — session required). Use SMOKE_ACCESS_TOKEN=(admin JWT) for full 200/404 check.",
  );
  process.exit(0);
}

if (res.status === 403) {
  console.log("Smoke OK (403 — caller is not an admin, or role check failed as expected).");
  process.exit(0);
}

console.error("Smoke FAILED: unexpected status/body.");
process.exit(1);
