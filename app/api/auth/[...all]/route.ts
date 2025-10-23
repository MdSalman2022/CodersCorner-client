import { NextRequest, NextResponse } from "next/server";

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
      redirect: "manual", // Don't follow redirects automatically
    });

    // Handle redirects (302, 307, etc.)
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (location) {
        const headers = new Headers();
        const cookies = response.headers.getSetCookie();
        cookies.forEach((cookie) => {
          headers.append("Set-Cookie", cookie);
        });
        headers.set("Location", location);

        return new NextResponse(null, {
          status: response.status,
          headers,
        });
      }
    }

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
    console.error("Auth proxy GET error:", error);
    return new Response(JSON.stringify({ error: "Auth proxy failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
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
      redirect: "manual", // Don't follow redirects automatically
    });

    // Handle redirects (302, 307, etc.)
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (location) {
        const headers = new Headers();
        const cookies = response.headers.getSetCookie();
        cookies.forEach((cookie) => {
          headers.append("Set-Cookie", cookie);
        });
        headers.set("Location", location);

        return new NextResponse(null, {
          status: response.status,
          headers,
        });
      }
    }

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
    console.error("Auth proxy POST error:", error);
    return new Response(JSON.stringify({ error: "Auth proxy failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
