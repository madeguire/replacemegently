import { NextRequest, NextResponse } from "next/server";

const MAX_BODY = 16_384;

function isValidEvent(name: unknown): name is string {
  return typeof name === "string" && /^[\w.-]{1,64}$/.test(name);
}

export async function POST(req: NextRequest) {
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  if (raw.length > MAX_BODY) {
    return NextResponse.json({ error: "payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const rec = body as Record<string, unknown>;
  if (!isValidEvent(rec.event)) {
    return NextResponse.json({ error: "invalid event" }, { status: 400 });
  }

  const line = JSON.stringify({
    type: "user_event",
    receivedAt: new Date().toISOString(),
    event: rec.event,
    properties: rec.properties ?? null,
    path: typeof rec.path === "string" ? rec.path : null,
    referrer: typeof rec.referrer === "string" ? rec.referrer : null,
    sessionId: typeof rec.sessionId === "string" ? rec.sessionId : null,
    clientTs: typeof rec.ts === "number" ? rec.ts : null,
  });

  console.info(line);

  return NextResponse.json({ ok: true });
}
