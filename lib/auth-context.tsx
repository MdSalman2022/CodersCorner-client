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
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const [user, setUser] = useState(session?.user || null);

  useEffect(() => {
    setUser(session?.user || null);
  }, [session]);

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
    } catch (error) {
      console.error("❌ Auth Context: Sign out error:", error);
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
