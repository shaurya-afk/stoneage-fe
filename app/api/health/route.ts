import { NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.BASEE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://stone-age.onrender.com";

/**
 * Proxy health check to the Stone Age backend at {BASE_URL}/health.
 * Runs on the server to avoid CORS.
 */
export async function GET() {
  try {
    const res = await fetch(`${BACKEND_BASE}/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const text = await res.text();
    let data: unknown = text;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      // leave as string
    }
    return NextResponse.json({
      ok: res.ok,
      reachable: true,
      status: res.status,
      data,
    });
  } catch {
    return NextResponse.json(
      { ok: false, reachable: false, error: "Backend unreachable" },
      { status: 502 }
    );
  }
}
