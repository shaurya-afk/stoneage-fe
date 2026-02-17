import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.BASEE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://stone-age.onrender.com";

/**
 * Proxy to Stone Age backend. Avoids CORS.
 * GET/POST /api/stone-age/health -> BACKEND_BASE/health
 * GET/POST /api/stone-age/api/v1/auth/signin -> BACKEND_BASE/api/v1/auth/signin
 */
async function proxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const search = request.nextUrl.search;
  const url = `${BACKEND_BASE}/${pathStr}${search || ""}`;
  const method = request.method;
  const headers = new Headers();
  request.headers.forEach((v, k) => {
    if (
      k.toLowerCase() !== "host" &&
      k.toLowerCase() !== "connection" &&
      k.toLowerCase() !== "content-length"
    ) {
      headers.set(k, v);
    }
  });
  let body: BodyInit | undefined;
  if (method !== "GET" && method !== "HEAD") {
    try {
      const contentType = request.headers.get("content-type") ?? "";
      if (contentType.includes("multipart/form-data")) {
        body = await request.arrayBuffer();
      } else {
        const text = await request.text();
        body = text || undefined;
      }
    } catch {
      // no body
    }
  }
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ?? undefined,
    });
    const contentType = res.headers.get("content-type") ?? "";
    const isBinary =
      contentType.includes("spreadsheetml") ||
      contentType.includes("octet-stream") ||
      contentType.includes("application/pdf") ||
      contentType.includes("image/");
    const bodyRes = isBinary ? await res.arrayBuffer() : await res.text();
    const resHeaders = new Headers();
    res.headers.forEach((v, k) => {
      const lower = k.toLowerCase();
      if (
        lower !== "transfer-encoding" &&
        lower !== "connection" &&
        lower !== "content-encoding" &&
        lower !== "content-length"
      ) {
        resHeaders.set(k, v);
      }
    });
    return new NextResponse(bodyRes, {
      status: res.status,
      statusText: res.statusText,
      headers: resHeaders,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Backend request failed", message: String(e) },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
