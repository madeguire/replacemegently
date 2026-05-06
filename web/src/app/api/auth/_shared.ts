import "server-only";

import { cookies } from "next/headers";

export const SESSION_COOKIE = "session";

export const API_URL = process.env.API_URL ?? "http://localhost:8000";

export interface BackendUser {
  id: number;
  email: string;
  fullName: string | null;
  isAdmin: boolean;
  createdAt: string;
}

export interface BackendToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: BackendUser;
}

export async function setSessionCookie(token: string, expiresIn: number) {
  const store = await cookies();
  store.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: expiresIn,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function readSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

interface CallApiOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  body?: unknown;
  token?: string | null;
}

export interface ApiResponse {
  status: number;
  data: unknown;
}

export async function callApi({ method, path, body, token }: CallApiOptions): Promise<ApiResponse> {
  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch (err) {
    return {
      status: 502,
      data: {
        detail:
          err instanceof Error
            ? `Catalog API unreachable: ${err.message}`
            : "Catalog API unreachable",
      },
    };
  }

  let data: unknown = null;
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    const text = await res.text();
    data = text ? { detail: text } : null;
  }

  return { status: res.status, data };
}
