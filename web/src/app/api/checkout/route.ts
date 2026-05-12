import "server-only";

import { NextResponse } from "next/server";
import { callApi } from "../auth/_shared";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON" }, { status: 400 });
  }

  const { status, data } = await callApi({
    method: "POST",
    path: "/checkout/create-session",
    body,
  });

  return NextResponse.json(data, { status });
}
