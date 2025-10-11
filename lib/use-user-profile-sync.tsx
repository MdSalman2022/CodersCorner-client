import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";

export function useUserProfileSync() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user && !isLoading) {
      syncUserProfile(user);
    }
  }, [user, isLoading]);

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

  return null;
}
