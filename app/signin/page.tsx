"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { apiProxyPost, apiProxyGet } from "@/lib/api";
import { setSession } from "@/lib/auth";
import { getSupabaseBrowser } from "@/lib/supabase";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiProxyPost<{ user?: { id: string; email?: string }; session?: { access_token: string; refresh_token?: string; expires_at?: number } }>("api/v1/auth/signin", { email, password });
      if (data?.session?.access_token) {
        setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token ?? null,
          expires_at: data.session.expires_at ?? null,
          user: data.user ? { id: data.user.id, email: data.user.email } : undefined,
        });
      }
      setSuccess(true);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Sign in failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    try {
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/api/auth/callback` : "";
      const supabase = getSupabaseBrowser();
      if (supabase) {
        const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo },
        });
        if (oauthError) {
          setError(oauthError.message ?? "Google sign-in failed");
          return;
        }
        if (data?.url) {
          window.location.href = data.url;
          return;
        }
      }
      const data = await apiProxyGet<{ url: string }>(`api/v1/auth/google/url?redirect_to=${encodeURIComponent(redirectTo)}`);
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setError("Could not get Google sign-in URL. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for Google sign-in.");
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Google sign-in failed";
      setError(msg);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-50">
        <div className="mx-auto h-full max-w-7xl">
          <div className="relative h-full">
            <div className="absolute left-0 top-0 h-full w-px bg-zinc-700/30" />
            <div className="absolute right-0 top-0 h-full w-px bg-zinc-700/30" />
          </div>
        </div>
      </div>

      <div className="min-h-screen w-full bg-zinc-900">
        <nav className="relative z-50 border-b border-zinc-700/30 px-6 py-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Stone Age</span>
            </Link>
            <Link href="/get-started">
              <Button variant="outline" className="border-zinc-600 bg-transparent text-white hover:bg-zinc-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </nav>

        <main className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-12 lg:px-16">
          <div className="max-w-md">
            <div className="flex items-center gap-3 px-4 py-2 border border-zinc-700 w-fit mb-6">
              <div className="w-2.5 h-2.5 bg-amber-500" />
              <span className="text-sm font-medium text-zinc-400 tracking-wide">Authentication</span>
            </div>
            <h1 className="text-4xl font-normal tracking-tight text-white">Sign in</h1>
            <p className="mt-2 text-zinc-400">Use your Stone Age account.</p>

            {success ? (
              <div className="mt-8 p-4 border border-amber-500/30 bg-amber-500/10 text-white">
                You are signed in. You can now use Extract data with your account.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded border border-zinc-600 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded border border-zinc-600 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-white text-slate-900 hover:bg-white/90"
                >
                  {loading ? "Signing in…" : "Sign in"}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-zinc-900 px-2 text-zinc-500">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  disabled={googleLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full border-zinc-600 bg-transparent text-white hover:bg-zinc-800"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" aria-hidden>
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {googleLoading ? "Redirecting…" : "Sign in with Google"}
                </Button>
              </form>
            )}

            <p className="mt-6 text-sm text-zinc-500">
              No account?{" "}
              <Link href="/signup" className="text-amber-500 hover:text-amber-400">
                Sign up
              </Link>
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
