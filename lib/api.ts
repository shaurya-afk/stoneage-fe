/**
 * Stone Age — API client. Backend base URL from env (BASEE_URL on server, NEXT_PUBLIC_API_URL for display).
 */

const BASE_URL =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "https://stone-age.onrender.com")
    : process.env.NEXT_PUBLIC_API_URL ?? "https://stone-age.onrender.com";

export const apiBaseUrl = BASE_URL;

export type ApiError = { message: string; status?: number };

/** Call our proxy (same-origin), which forwards to the backend. Path should be e.g. "health" or "api/v1/auth/signin". */
export async function apiProxyGet<T = unknown>(path: string): Promise<T> {
  const url = `/api/stone-age/${path.replace(/^\//, "")}`;
  const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
  const text = await res.text();
  if (!res.ok) {
    let message = text || res.statusText;
    try {
      const json = JSON.parse(text);
      message = json.message ?? json.detail ?? json.error ?? message;
    } catch {
      // use text
    }
    throw { message, status: res.status } as ApiError;
  }
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

/** POST via proxy. Path e.g. "api/v1/auth/signin", body as object. */
export async function apiProxyPost<T = unknown>(
  path: string,
  body?: unknown
): Promise<T> {
  const url = `/api/stone-age/${path.replace(/^\//, "")}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    let message = text || res.statusText;
    try {
      const json = JSON.parse(text);
      message = json.message ?? json.detail ?? json.error ?? message;
    } catch {
      // use text
    }
    throw { message, status: res.status } as ApiError;
  }
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export type HealthResult = {
  ok: boolean;
  reachable?: boolean;
  status?: number;
  data?: unknown;
  error?: string;
  timedOut?: boolean;
};

/** Check backend health via our /api/health proxy (hits backend /health). */
export async function checkBackendHealth(): Promise<HealthResult> {
  try {
    const res = await fetch("/api/health", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const json = await res.json();
    return {
      ok: json.ok ?? false,
      reachable: json.reachable,
      status: json.status,
      data: json.data,
      error: json.error,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, reachable: false, error: message };
  }
}

const BACKEND_UNREACHABLE_KEY = "stoneage_backend_unreachable";
const UNREACHABLE_TTL_MS = 10 * 60 * 1000; // 10 min

export function markBackendUnreachable(): void {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(BACKEND_UNREACHABLE_KEY, String(Date.now()));
  }
}

export function clearBackendUnreachable(): void {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(BACKEND_UNREACHABLE_KEY);
  }
}

export function isBackendKnownUnreachable(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  const raw = sessionStorage.getItem(BACKEND_UNREACHABLE_KEY);
  if (!raw) return false;
  const t = Number(raw);
  if (Number.isNaN(t) || Date.now() - t > UNREACHABLE_TTL_MS) {
    sessionStorage.removeItem(BACKEND_UNREACHABLE_KEY);
    return false;
  }
  return true;
}
