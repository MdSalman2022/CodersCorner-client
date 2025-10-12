"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  BookOpen,
  User,
  BarChart3,
  Users,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface FollowingUser {
  _id: string;
  name: string;
  avatar?: string;
  userId: string;
}

export function MediumSidebar() {
  const { user } = useAuth();
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFollowing();
    }
  }, [user]);

  const fetchFollowing = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user?.id}`
      );
      if (response.ok) {
        const userData = await response.json();
        setFollowing(userData.following || []);
      }
    } catch (error) {
      console.error("Failed to fetch following:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: BookOpen, label: "Library", href: "/library" },
    {
      icon: User,
      label: "Profile",
      href: user ? `/profile/${user.id}` : "/auth/login",
    },
    { icon: BarChart3, label: "Stats", href: "/stats" },
  ];

  return (
    <aside className="w-72 h-screen sticky top-16 border-r bg-background p-6 overflow-y-auto">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start h-10 px-3"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Link>
          </Button>
        ))}

        {/* Following Section */}
        <div className="pt-4">
          <Button
            variant="ghost"
            className="w-full justify-between h-10 px-3"
            onClick={() => setShowFollowing(!showFollowing)}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-3" />
              Following
            </div>
            {showFollowing ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          {showFollowing && (
            <div className="ml-7 mt-2 space-y-1">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : following.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Not following anyone yet
                </div>
              ) : (
                following.slice(0, 10).map((followedUser) => (
                  <Link
                    key={followedUser._id}
                    href={`/profile/${followedUser.userId}`}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={followedUser.avatar} />
                      <AvatarFallback className="text-xs">
                        {followedUser.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm truncate">
                      {followedUser.name}
                    </span>
                  </Link>
                ))
              )}
              {following.length > 10 && (
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  See all ({following.length})
                </Button>
              )}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
