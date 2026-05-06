import "server-only";

import { NextResponse } from "next/server";

import {
  callApi,
  clearSessionCookie,
  readSessionToken,
} from "../auth/_shared";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ProxyOptions {
  method: Method;
  path: string;
  request?: Request;
}

/** Forward an admin request to the FastAPI backend with the bearer token from the cookie. */
export async function proxyAdmin({
  method,
  path,
  request,
}: ProxyOptions): Promise<NextResponse> {
  const token = await readSessionToken();
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  let body: unknown = undefined;
  if (request && method !== "GET" && method !== "DELETE") {
    const text = await request.text();
    if (text.length > 0) {
      try {
        body = JSON.parse(text);
      } catch {
        return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
      }
    }
  }

  const { status, data } = await callApi({
    method,
    path,
    body,
    token,
  });

  if (status === 401) {
    await clearSessionCookie();
  }

  if (status === 204 || data === null || data === undefined) {
    return new NextResponse(null, { status });
  }

  return NextResponse.json(data, { status });
}
