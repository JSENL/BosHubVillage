#!/usr/bin/env node
/**
 * Smoke test: invoke `send-content-alerts` and ensure the handler responds.
 *
 * Required env:
 *   SUPABASE_URL              — project URL (e.g. https://xxx.supabase.co)
 *   SUPABASE_ANON_KEY         — or SUPABASE_SERVICE_ROLE_KEY (either works for invoke)
 *
 * Optional:
 *   SMOKE_CONTENT_ALERT_ITEM_TYPE — default "event"
 *   SMOKE_CONTENT_ALERT_ITEM_ID   — default placeholder UUID (expects 404 Item not found)
 *
 * Success:
 *   - HTTP 200 with dispatch JSON (real item id), or
 *   - HTTP 404 with { error: "Item not found" } (proves function + DB round-trip)
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

const itemType = process.env.SMOKE_CONTENT_ALERT_ITEM_TYPE || "event";
const itemId =
  process.env.SMOKE_CONTENT_ALERT_ITEM_ID || "00000000-0000-0000-0000-000000000001";

if (!baseUrl || !apiKey) {
  console.error(
    "smoke-send-content-alerts: set SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY / VITE_SUPABASE_PUBLISHABLE_KEY).",
  );
  process.exit(1);
}

const endpoint = `${baseUrl}/functions/v1/send-content-alerts`;

const res = await fetch(endpoint, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
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

console.error("Smoke FAILED: expected 200 (dispatch) or 404 (missing item).");
process.exit(1);
