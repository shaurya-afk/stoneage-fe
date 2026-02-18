"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorServerMessage } from "@/components/error-server-message";
import { setSession } from "@/lib/auth";
import { getSupabaseBrowser } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash?.slice(1) || "";
    const query = window.location.search?.slice(1) || "";
    const hashParams = new URLSearchParams(hash);
    const queryParams = new URLSearchParams(query);
    const get = (key: string) => hashParams.get(key) ?? queryParams.get(key);

    // Error from server-side callback redirect
    const serverError = queryParams.get("error");
    if (serverError) {
      setError(decodeURIComponent(serverError));
      return;
    }

    // 1) Tokens in hash/query (implicit flow)
    const accessToken = get("access_token");
    const refreshToken = get("refresh_token");
    const expiresIn = get("expires_in");
    if (accessToken) {
      const expiresAt = expiresIn ? Date.now() + Number(expiresIn) * 1000 : null;
      setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
      });
      router.replace("/extract");
      return;
    }

    // 2) PKCE: code in query – exchange via Supabase client (same client that started the flow)
    const code = queryParams.get("code");
    if (code) {
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env");
        return;
      }
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ data: { session }, error: exchangeError }) => {
          if (exchangeError) {
            setError(exchangeError.message || "Failed to complete sign-in");
            return;
          }
          if (session?.access_token) {
            setSession({
              access_token: session.access_token,
              refresh_token: session.refresh_token ?? null,
              expires_at: session.expires_at ?? null,
              user: session.user ? { id: session.user.id, email: session.user.email ?? null } : undefined,
            });
            router.replace("/extract");
          } else {
            setError("No session after sign-in.");
          }
        })
        .catch((e) => setError(e?.message ?? "Sign-in failed"));
      return;
    }

    const errorParam = get("error_description") || get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      return;
    }

    setError("No access token or code received. Use “Sign in with Google” from the sign-in page.");
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen w-full bg-zinc-900 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white mb-8">
            <Shield className="h-5 w-5 text-amber-500" />
            <span className="font-medium">Stone Age</span>
          </Link>
          <p className="text-red-400 mb-2">{error}</p>
          <div className="mb-4">
            <ErrorServerMessage />
          </div>
          <p className="text-zinc-500 text-sm mb-6 max-w-sm">
            Add <span className="font-mono text-zinc-400">NEXT_PUBLIC_SUPABASE_URL</span> and <span className="font-mono text-zinc-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> to <span className="font-mono text-zinc-400">.env</span> (from Supabase project Settings → API). Ensure <span className="font-mono text-zinc-400">http://localhost:3000/api/auth/callback</span> is in Supabase Redirect URLs.
          </p>
          <Button asChild className="bg-white text-slate-900 hover:bg-white/90">
            <Link href="/signin">Back to Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-900 flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
        <p className="text-zinc-400">Completing sign-in…</p>
      </div>
    </div>
  );
}
