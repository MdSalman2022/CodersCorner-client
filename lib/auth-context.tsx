"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient, useSession } from "@/lib/auth";

interface AuthContextType {
  user: any;
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

  useEffect(() => {
    if (session?.user && !isPending) {
      fetchUserData(session.user);
    } else {
      setUser(null);
    }
  }, [session, isPending]);

  // Fetch complete user data from our API (includes role info)
  const fetchUserData = async (sessionUser: any) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/me`, {
        method: "POST", // Change to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: sessionUser.id,
        }),
      });

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

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        console.error(
          "Auth Context - API call failed:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // Fallback to session user
      setUser(sessionUser);
    }
  };

  // Sync user profile to userinfo collection after authentication
  useEffect(() => {
    if (user && !isPending) {
      syncUserProfile(user);
    }
  }, [user, isPending]);

  const syncUserProfile = async (user: any) => {
    try {
      // Check if user profile exists in our userinfo collection
      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}`
      );
      const profileExists = response.ok;

      if (!profileExists) {
        // Create user profile in userinfo collection
        const createResponse = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            betterAuthId: user.id,
            name: user.name || "User",
            email: user.email,
            avatar: user.image || null,
            bio: null,
            website: null,
            location: null,
            skills: [],
            socialLinks: {
              github: null,
              linkedin: null,
              twitter: null,
            },
            followers: [],
            following: [],
            preferences: {
              topics: [],
              darkMode: false,
            },
            stats: {
              postsCount: 0,
              followersCount: 0,
              followingCount: 0,
            },
          }),
        });

        if (createResponse.ok) {
          console.log("✅ User profile created in userinfo collection");
          // Refresh user data after profile creation
          if (session?.user) {
            fetchUserData(session.user);
          }
        } else {
          console.error("❌ Failed to create user profile");
        }
      } else {
        console.log("✅ User profile already exists");
      }
    } catch (error) {
      console.error("❌ Error syncing user profile:", error);
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
      // Redirect to home page after successful signup
      window.location.href = "http://localhost:3000/";
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
      window.location.href = "http://localhost:3000/";
    } catch (error) {
      console.error("❌ Auth Context: Login error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log("🔄 Auth Context: Calling Google sign-in...");
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000/",
      });
      console.log("✅ Auth Context: Google sign-in initiated");
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
      window.location.href = "http://localhost:3000/";
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
