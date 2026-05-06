import { NextResponse } from "next/server";

import { callApi, clearSessionCookie, readSessionToken } from "../_shared";

export async function GET() {
  const token = await readSessionToken();
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const { status, data } = await callApi({
    method: "GET",
    path: "/auth/me",
    token,
  });

  if (status === 401) {
    await clearSessionCookie();
  }

  return NextResponse.json(data ?? null, { status });
}
