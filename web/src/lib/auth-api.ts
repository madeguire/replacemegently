export interface User {
  id: number;
  email: string;
  fullName: string | null;
  isAdmin: boolean;
  createdAt: string;
}

export class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

interface ErrorPayload {
  detail?: unknown;
}

async function parseError(res: Response, fallback: string): Promise<AuthError> {
  let detail = fallback;
  try {
    const data = (await res.json()) as ErrorPayload;
    if (typeof data?.detail === "string" && data.detail.length > 0) {
      detail = data.detail;
    } else if (Array.isArray(data?.detail) && data.detail.length > 0) {
      const first = data.detail[0] as { msg?: unknown } | undefined;
      if (first && typeof first.msg === "string") detail = first.msg;
    }
  } catch {}
  return new AuthError(detail, res.status);
}

export async function login(email: string, password: string): Promise<User> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw await parseError(res, "Login failed");
  return (await res.json()) as User;
}

export async function register(
  email: string,
  password: string,
  fullName?: string,
): Promise<User> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName: fullName ?? null }),
  });
  if (!res.ok) throw await parseError(res, "Registration failed");
  return (await res.json()) as User;
}

export async function getMe(): Promise<User | null> {
  const res = await fetch("/api/auth/me", { method: "GET", cache: "no-store" });
  if (res.status === 401) return null;
  if (!res.ok) throw await parseError(res, "Could not load account");
  return (await res.json()) as User;
}

export async function logout(): Promise<void> {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  if (!res.ok) throw await parseError(res, "Logout failed");
}
