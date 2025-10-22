/**
 * Auth Route - Not needed for this project
 *
 * The backend (coders-corner-server) handles all authentication via Better Auth
 * This route file is kept for reference but the actual auth requests are proxied
 * to the backend API at process.env.NEXT_PUBLIC_SERVER_URL/api/auth
 *
 * The client uses `better-auth/react` which sends requests directly to the backend.
 */

export async function GET() {
  return new Response(
    JSON.stringify({
      message: "Auth is handled by the backend API",
      authUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth`,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

export async function POST() {
  return new Response(
    JSON.stringify({
      message: "Auth is handled by the backend API",
      authUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth`,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
