"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Loader2, CheckCircle2, XCircle, LogIn, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { checkBackendHealth, apiBaseUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function GetStartedPage() {
  const [status, setStatus] = useState<{
    ok: boolean;
    reachable?: boolean;
    status?: number;
    data?: unknown;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    checkBackendHealth().then((result) => {
      if (!cancelled) {
        setStatus(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const healthy = status?.reachable && status?.ok;
  const reachableWithError = status?.reachable && !status?.ok;

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
            <Link href="/">
              <Button
                variant="outline"
                className="border-zinc-600 bg-transparent text-white hover:bg-zinc-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </nav>

        <main className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-12 lg:px-16">
          <div className="flex flex-col gap-6 max-w-[560px]">
            <div className="flex items-center gap-3 px-4 py-2 border border-zinc-700 w-fit">
              <div className="w-2.5 h-2.5 bg-amber-500" />
              <span className="text-sm font-medium text-zinc-400 tracking-wide">
                Get Started
              </span>
            </div>
            <h1 className="text-balance text-4xl font-normal tracking-tight text-white md:text-5xl lg:text-6xl">
              Upload to Stone Age
            </h1>
            <p className="text-balance text-base leading-relaxed text-zinc-400 max-w-xl">
              Upload a PDF, image, or raw text to Stone Age and start extracting data.
            </p>

            {/* Backend status — clean when healthy */}
            <div className="mt-8 border border-zinc-700/50 bg-zinc-800/50 p-6">
              <h2 className="text-lg font-medium text-white mb-4">
                Backend status
              </h2>
              {loading ? (
                <div className="flex items-center gap-3 text-zinc-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Checking connection…</span>
                </div>
              ) : status ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {status.reachable !== false ? (
                      <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                    )}
                    <span
                      className={cn(
                        status.reachable !== false ? "text-white" : "text-zinc-300"
                      )}
                    >
                      {healthy
                        ? "Backend is reachable"
                        : status.reachable
                          ? "Backend responded with an error"
                          : status.error || "Backend unreachable"}
                    </span>
                  </div>
                  {healthy && status.data && typeof status.data === "object" && "status" in status.data ? (
                    <p className="text-sm text-zinc-400">
                      Status: {(status.data as { status?: string }).status ?? "—"}
                    </p>
                  ) : null}
                  {reachableWithError && status.status != null && (
                    <p className="text-sm text-zinc-500">HTTP status: {status.status}</p>
                  )}
                  {status.reachable === false && (
                    <p className="text-sm text-zinc-500">
                      Ensure the backend is running at {apiBaseUrl}/health
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            {/* In-app actions instead of Open API */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              {/* <Button
                size="lg"
                className="bg-white px-6 text-slate-900 hover:bg-white/90"
                asChild
              >
                <Link href="/signin">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </Link>
              </Button> */}
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-600 bg-transparent px-6 text-white hover:bg-zinc-800"
                asChild
              >
                <Link href="/extract">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Extract data
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-600 bg-transparent px-6 text-white hover:bg-zinc-800"
                asChild
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
