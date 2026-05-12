const SESSION_KEY = "human-tm-event-session";
const MAX_PAYLOAD_BYTES = 12_288;

function getSessionId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

function sanitizeProperties(
  properties: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  if (!properties || typeof properties !== "object") return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(properties)) {
    if (!/^[\w.-]{1,48}$/.test(k)) continue;
    if (typeof v === "string" && v.length <= 256) out[k] = v;
    else if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
    else if (typeof v === "boolean") out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * Fire-and-forget client event. Safe to call from the browser only; no-ops on the server.
 * Events are POSTed to /api/events and logged server-side (structured JSON on stdout).
 */
export function track(event: string, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!/^[\w.-]{1,64}$/.test(event)) return;

  const props = sanitizeProperties(properties);
  const payload = {
    event,
    properties: props,
    path: window.location.pathname,
    referrer: document.referrer || undefined,
    sessionId: getSessionId(),
    ts: Date.now(),
  };

  const body = JSON.stringify(payload);
  if (body.length > MAX_PAYLOAD_BYTES) return;

  try {
    const url = "/api/events";
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    } else {
      void fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // intentionally ignore — analytics must not break the app
  }
}
