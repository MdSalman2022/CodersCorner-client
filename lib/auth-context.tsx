"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient, useSession } from "@/lib/auth";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
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
    } catch (error) {
      console.error("❌ Auth Context: Login error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("🔄 Auth Context: Calling signOut...");
      await authClient.signOut();
      setUser(null);
      console.log("✅ Auth Context: Logout successful");
    } catch (error) {
      console.error("❌ Auth Context: Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isPending,
        signIn,
        signUp,
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
