import { NextResponse } from "next/server";

import { callApi, setSessionCookie, type BackendToken } from "../_shared";

interface LoginBody {
  email?: unknown;
  password?: unknown;
}

export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json(
      { detail: "Email and password are required" },
      { status: 400 },
    );
  }

  const { status, data } = await callApi({
    method: "POST",
    path: "/auth/login",
    body: { email, password },
  });

  if (status >= 200 && status < 300 && data && typeof data === "object") {
    const token = data as BackendToken;
    await setSessionCookie(token.accessToken, token.expiresIn);
    return NextResponse.json(token.user, { status: 200 });
  }

  return NextResponse.json(data ?? { detail: "Login failed" }, { status });
}
