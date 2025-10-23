import { NextRequest } from "next/server";

/**
 * Auth Proxy Route
 *
 * This proxies all Better Auth requests to the backend server.
 * This is necessary for cross-domain authentication to work properly
 * because cookies can be set on the same domain as the frontend.
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { all: string[] } }
) {
  const path = params.all?.join("/") || "";
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const url = new URL(request.url);

  try {
    const response = await fetch(`${serverUrl}/api/auth/${path}${url.search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") || "",
      },
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Create response with proper headers
    const headers = new Headers();

    // Forward all Set-Cookie headers
    const cookies = response.headers.getSetCookie();
    cookies.forEach((cookie) => {
      headers.append("Set-Cookie", cookie);
    });

    // Forward content type
    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    return new Response(
      typeof data === "string" ? data : JSON.stringify(data),
      {
        status: response.status,
        headers,
      }
    );
  } catch (error) {
    console.error("Auth proxy error:", error);
    return new Response(JSON.stringify({ error: "Auth proxy failed" }), {
      status: 500,
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { all: string[] } }
) {
  const path = params.all?.join("/") || "";
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  try {
    const body = await request.text();

    const response = await fetch(`${serverUrl}/api/auth/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") || "",
      },
      body,
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Create response with proper headers
    const headers = new Headers();

    // Forward all Set-Cookie headers
    const cookies = response.headers.getSetCookie();
    cookies.forEach((cookie) => {
      headers.append("Set-Cookie", cookie);
    });

    // Forward content type
    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    return new Response(
      typeof data === "string" ? data : JSON.stringify(data),
      {
        status: response.status,
        headers,
      }
    );
  } catch (error) {
    console.error("Auth proxy error:", error);
    return new Response(JSON.stringify({ error: "Auth proxy failed" }), {
      status: 500,
    });
  }
}
