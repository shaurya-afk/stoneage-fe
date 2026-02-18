"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Shield, ArrowLeft, FileSpreadsheet, Upload, LogIn, Download, Mail, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { getAccessTokenAsync } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { ErrorServerMessage } from "@/components/error-server-message";

export default function ExtractPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [fields, setFields] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAccessTokenAsync().then((token) => {
      setAccessToken(token);
      setAuthChecked(true);
    });
  }, []);

  const isAuthenticated = !!accessToken;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }
    setError(null);
    setResult(null);
    setEmailSent(false);
    setEmailError(null);
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", documentType || "invoice");
    formData.append("fields", fields || "invoice_number,invoice_date,total_amount");
    const headers: HeadersInit = {};
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    try {
      const res = await fetch("/api/stone-age/api/v1/extract", {
        method: "POST",
        headers,
        body: formData,
      });
      const text = await res.text();
      if (!res.ok) {
        let msg = text;
        try {
          const j = JSON.parse(text);
          msg = j.detail ?? j.message ?? j.error ?? msg;
        } catch {
          // use text
        }
        throw new Error(msg);
      }
      setResult(text ? JSON.parse(text) : null);
      setEmailSent(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Extraction failed");
    } finally {
      setLoading(false);
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
              <Diamond className="h-5 w-5 text-amber-500" />
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
          <div className="max-w-lg">
            <div className="flex items-center gap-3 px-4 py-2 border border-zinc-700 w-fit mb-6">
              <div className="w-2.5 h-2.5 bg-amber-500" />
              <span className="text-sm font-medium text-zinc-400 tracking-wide">Extraction</span>
            </div>
            <h1 className="text-4xl font-normal tracking-tight text-white flex items-center gap-2">
              <FileSpreadsheet className="h-9 w-9 text-amber-500" />
              Extract data
            </h1>
            <p className="mt-2 text-zinc-400">
              Upload a PDF to extract structured data (e.g. invoice fields). You must be signed in.
            </p>

            {authChecked && !isAuthenticated ? (
              <div className="mt-8 p-6 rounded border border-amber-500/30 bg-amber-500/10">
                <p className="text-white mb-4">You need to sign in to extract data.</p>
                <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-white/90">
                  <Link href="/signin">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in
                  </Link>
                </Button>
              </div>
            ) : (
            <>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">PDF file</label>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className={cn(
                    "w-full rounded border border-dashed px-4 py-6 text-left transition-colors",
                    file ? "border-amber-500/50 bg-amber-500/5 text-white" : "border-zinc-600 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <Upload className="inline-block h-5 w-5 mr-2" />
                  {file ? file.name : "Choose a PDF file"}
                </button>
              </div>
              <div>
                <label htmlFor="document_type" className="block text-sm font-medium text-zinc-300 mb-1">Document type</label>
                <input
                  id="document_type"
                  type="text"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full rounded border border-zinc-600 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="e.g. invoice"
                />
              </div>
              <div>
                <label htmlFor="fields" className="block text-sm font-medium text-zinc-300 mb-1">Fields (comma-separated)</label>
                <input
                  id="fields"
                  type="text"
                  value={fields}
                  onChange={(e) => setFields(e.target.value)}
                  className="w-full rounded border border-zinc-600 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="e.g. invoice_number, invoice_date, total_amount"
                />
              </div>
              {error && (
                <div>
                  <p className="text-sm text-red-400">{error}</p>
                  <ErrorServerMessage />
                </div>
              )}
              <Button
                type="submit"
                size="lg"
                disabled={loading || !file}
                className="w-full bg-white text-slate-900 hover:bg-white/90"
              >
                {loading ? "Extracting…" : "Extract"}
              </Button>
            </form>

            {result && typeof result === "object" && (
              <div className="mt-8 rounded border border-zinc-700 bg-zinc-800/50 p-4 space-y-4">
                <h3 className="text-sm font-medium text-white">Result</h3>
                {(() => {
                  const obj = result as Record<string, unknown>;
                  const metaKeys = ["excel_path", "email_sent", "email_note"];
                  const tableEntries = Object.entries(obj).filter(
                    ([k, v]) => !metaKeys.includes(k) && v != null
                  );
                  const excelPath = obj.excel_path as string | undefined;
                  const resultEmailSent = obj.email_sent as boolean | undefined;
                  const emailNote = obj.email_note as string | undefined;
                  const alreadySent = emailSent;
                  return (
                    <>
                      <div className="overflow-x-auto rounded border border-zinc-700">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-zinc-700 bg-zinc-800">
                              <th className="px-4 py-2 text-left font-medium text-zinc-300">Field</th>
                              <th className="px-4 py-2 text-left font-medium text-zinc-300">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableEntries.map(([key, value]) => (
                              <tr key={key} className="border-b border-zinc-700/50">
                                <td className="px-4 py-2 text-zinc-400">{key}</td>
                                <td className="px-4 py-2 text-white">{String(value)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        {excelPath && (
                          <Button
                            type="button"
                            size="sm"
                            className="bg-white text-slate-900 hover:bg-white/90"
                            onClick={async () => {
                              const url = `/api/stone-age/api/v1/extract/excel/download?path=${encodeURIComponent(excelPath)}`;
                              const res = await fetch(url, {
                                headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
                              });
                              if (!res.ok) return;
                              const blob = await res.blob();
                              const name = excelPath.split(/[/\\]/).pop() ?? "extraction.xlsx";
                              const a = document.createElement("a");
                              a.href = URL.createObjectURL(blob);
                              a.download = name;
                              a.click();
                              URL.revokeObjectURL(a.href);
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Excel
                          </Button>
                        )}
                        {/* {excelPath && accessToken && (
                          <Button
                            type="button"
                            size="sm"
                            disabled={emailSending}
                            className="bg-white text-slate-900 hover:bg-white/90 disabled:opacity-70"
                            onClick={async () => {
                              setEmailError(null);
                              setEmailSending(true);
                              try {
                                const res = await fetch("/api/stone-age/api/v1/extract/send-email", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${accessToken}`,
                                  },
                                  body: JSON.stringify({ excel_path: excelPath }),
                                });
                                const data = await res.json().catch(() => ({}));
                                if (res.ok && data.sent) {
                                  setEmailSent(true);
                                } else {
                                  let msg: string;
                                  if (res.ok) {
                                    msg = data.note ?? "Failed to send";
                                  } else if (res.status === 404) {
                                    msg = "Report file is no longer on the server. Download the Excel first, then run extraction again if you need it emailed.";
                                  } else {
                                    msg = data.detail ?? data.message ?? `Request failed (${res.status})`;
                                  }
                                  setEmailError(typeof msg === "string" ? msg : JSON.stringify(msg));
                                }
                              } catch {
                                setEmailError("Network error. Try again.");
                              } finally {
                                setEmailSending(false);
                              }
                            }}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            {emailSending ? "Sending…" : alreadySent ? "Sent to your email" : "Send to my email"}
                          </Button>
                        )}
                        {emailError && (
                          <p className="text-xs text-amber-400">
                            {emailError}
                          </p>
                        )}
                        {emailNote !== undefined && !excelPath && (
                          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Mail className="h-3.5 w-3.5" />
                            {resultEmailSent ? "Sent to your email" : emailNote === "no_excel_path" ? "Report not emailed" : `Email: ${emailNote}`}
                          </span>
                        )} */}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
            </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
