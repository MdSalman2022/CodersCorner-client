import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin // Use same domain for auth (proxied)
      : process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000",
  fetchOptions: {
    credentials: "include",
  },
});

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;
