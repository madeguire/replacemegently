import { NextResponse } from "next/server";

import { API_URL } from "../../auth/_shared";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const qs = url.search;
  try {
    const res = await fetch(`${API_URL}/collections${qs}`, { cache: "no-store" });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (err) {
    return NextResponse.json(
      { detail: err instanceof Error ? err.message : "Catalog API unreachable" },
      { status: 502 },
    );
  }
}
