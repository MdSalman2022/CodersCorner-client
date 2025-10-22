"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient, useSession } from "@/lib/auth";

interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  image?: string | null;
  betterAuthId?: string;
  roleName?: string;
  role?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
  emailVerified?: boolean;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const [user, setUser] = useState(session?.user || null);

  // Auto-refresh session every 30 minutes to prevent expiration
  useEffect(() => {
    if (session?.user) {
      const refreshInterval = setInterval(async () => {
        try {
          // Refresh by getting new session
          await authClient.getSession();
          console.log("🔄 Session refreshed automatically");
        } catch (error) {
          console.error("Failed to refresh session:", error);
        }
      }, 30 * 60 * 1000); // 30 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [session?.user]);

  useEffect(() => {
    console.log("🔍 Auth Context - Session changed:", {
      hasSession: !!session,
      isPending,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
    });

    if (session?.user && !isPending) {
      fetchUserData(session.user);
    } else if (!session && !isPending) {
      console.log("🔄 Auth Context - No session, clearing user");
      setUser(null);
      localStorage.removeItem("user");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, isPending]);

  // Fetch complete user data from our API (includes role info)
  const fetchUserData = async (sessionUser: User) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/me`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: sessionUser.id,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const userData = data.user;

        console.log("Auth Context - API Response:", data);
        console.log("Auth Context - User Data:", userData);
        console.log("Auth Context - Role Name:", userData.roleName);

        // Ensure roleName is set
        if (!userData.roleName && userData.role) {
          userData.roleName = userData.role.name;
        }

        // CRITICAL: Ensure user.id is always the betterAuthId
        if (!userData.id) {
          userData.id = userData.betterAuthId || sessionUser.id;
          console.log("⚠️ Fixed missing user.id:", userData.id);
        }

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else if (response.status === 404) {
        // User profile doesn't exist, need to sync
        const errorData = await response.json();
        if (errorData.needsSync) {
          console.log("🔄 User profile not found, syncing...");

          // Call sync-profile to create the profile
          try {
            const syncResponse = await fetch(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/sync-profile`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: sessionUser.id,
                  email: sessionUser.email,
                  name: sessionUser.name,
                  image: sessionUser.image,
                }),
              }
            );

            if (syncResponse.ok) {
              console.log("✅ User profile synced, fetching data again...");
              // Retry fetching user data
              await fetchUserData(sessionUser);
              return;
            } else {
              console.error(
                "Failed to sync profile:",
                await syncResponse.json()
              );
            }
          } catch (syncError) {
            console.error("Error syncing profile:", syncError);
          }
        }

        // If sync failed, clear session
        console.log("❌ Could not sync user profile, signing out");
        await signOut();
      } else {
        console.error(
          "Auth Context - API call failed:",
          response.status,
          response.statusText
        );
        // If API fails, fall back to session user but don't set as logged in
        if (response.status === 401) {
          console.log("🔄 Session expired, clearing session");
          await signOut();
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // If network error, keep session user as fallback but mark as loading
      setUser(sessionUser as unknown as typeof user);
    }
  };

  // Periodic session validation
  useEffect(() => {
    if (user) {
      const validateSession = async () => {
        try {
          const currentSession = await authClient.getSession();
          if (!currentSession?.data?.user) {
            console.log("🔄 Session expired, signing out...");
            await signOut();
          }
        } catch (error) {
          console.error("Session validation failed:", error);
        }
      };

      // Check session validity every 5 minutes
      const sessionCheck = setInterval(validateSession, 5 * 60 * 1000);

      return () => clearInterval(sessionCheck);
    }
  }, [user]);

  // Helper function to sync user profile with backend
  const syncUserProfile = async (
    userId: string,
    email: string,
    name: string,
    image?: string | null
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/sync-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            email,
            name,
            image: image || undefined,
          }),
        }
      );

      if (response.ok) {
        console.log("✅ Auth Context: Profile synced with backend");
        return true;
      } else {
        const errorData = await response.json();
        console.warn("⚠️  Auth Context: Failed to sync profile:", errorData);
        return false;
      }
    } catch (error) {
      console.warn("⚠️  Auth Context: Profile sync error:", error);
      return false;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      console.log("🔄 Auth Context: Calling signUp...");
      await authClient.signUp.email({
        email,
        password,
        name,
      });

      console.log("✅ Auth Context: Signup successful");

      // Wait for session to be established
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get the session to get userId
      const session = await authClient.getSession();
      console.log("🔄 Auth Context: Got session:", session);

      if (session?.data?.user?.id) {
        // Sync profile with backend
        await syncUserProfile(
          session.data.user.id,
          session.data.user.email,
          session.data.user.name,
          session.data.user.image
        );
      }

      // Redirect to home page after successful signup
      window.location.href =
        process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000";
    } catch (error) {
      console.error("❌ Auth Context: Signup error:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔄 Auth Context: Calling signIn...");
      await authClient.signIn.email({
        email,
        password,
      });
      console.log("✅ Auth Context: Login successful");
      // Redirect to home page after successful login
      window.location.href =
        process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000";
    } catch (error) {
      console.error("❌ Auth Context: Login error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log("🔄 Auth Context: Calling Google sign-in...");

      // Initiate Google sign-in
      await authClient.signIn.social({
        provider: "google",
        callbackURL:        process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000";
      });

      console.log("✅ Auth Context: Google sign-in completed, redirecting...");
      // Better Auth handles the redirect automatically
    } catch (error) {
      console.error("❌ Auth Context: Google sign-in error:", error);
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      console.log("🔄 Auth Context: Calling GitHub sign-in...");
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "http://localhost:3000/",
      });
      console.log("✅ Auth Context: GitHub sign-in initiated");
    } catch (error) {
      console.error("❌ Auth Context: GitHub sign-in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("🔄 Auth Context: Calling signOut...");
      await authClient.signOut();
      console.log("✅ Auth Context: Sign out successful");
      setUser(null);
      localStorage.removeItem("user");
      // Redirect to home page after sign out
      window.location.href = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000";
    } catch (error) {
      console.error("❌ Auth Context: Sign out error:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      console.log("🔄 Auth Context: Refreshing user data...");
      if (session?.user) {
        await fetchUserData(session.user);
        console.log("✅ Auth Context: User data refreshed");
      }
    } catch (error) {
      console.error("❌ Auth Context: Refresh user error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isPending,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithGithub,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
