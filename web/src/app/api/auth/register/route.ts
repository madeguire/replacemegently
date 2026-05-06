import { NextResponse } from "next/server";

import { callApi, setSessionCookie, type BackendToken } from "../_shared";

interface RegisterBody {
  email?: unknown;
  password?: unknown;
  fullName?: unknown;
}

export async function POST(request: Request) {
  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const fullName =
    typeof body.fullName === "string" && body.fullName.trim().length > 0
      ? body.fullName.trim()
      : null;

  if (!email || !password) {
    return NextResponse.json(
      { detail: "Email and password are required" },
      { status: 400 },
    );
  }

  const { status, data } = await callApi({
    method: "POST",
    path: "/auth/register",
    body: { email, password, fullName },
  });

  if (status >= 200 && status < 300 && data && typeof data === "object") {
    const token = data as BackendToken;
    await setSessionCookie(token.accessToken, token.expiresIn);
    return NextResponse.json(token.user, { status: 201 });
  }

  return NextResponse.json(data ?? { detail: "Registration failed" }, { status });
}
