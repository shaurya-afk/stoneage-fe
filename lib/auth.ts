/**
 * Stone Age — client-side session (access_token) for authenticated API calls.
 */

const STORAGE_KEY = "stone_age_session";

export type Session = {
  access_token: string;
  refresh_token?: string | null;
  expires_at?: number | null;
  user?: { id: string; email?: string | null };
};

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Session;
    return data?.access_token ? data : null;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  const s = getSession();
  return s?.access_token ?? null;
}

export function setSession(session: Session): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * Get access token from Supabase session (cookies) or localStorage.
 * Use this when the user might have signed in with Google (session in cookies).
 */
export async function getAccessTokenAsync(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const { getSupabaseBrowser } = await import("@/lib/supabase");
    const supabase = getSupabaseBrowser();
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) return session.access_token;
    }
  } catch {
    // ignore
  }
  return getAccessToken();
}
