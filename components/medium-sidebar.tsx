"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  User,
  BarChart3,
  Users,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface FollowingUser {
  _id: string;
  name: string;
  avatar?: string;
  email: string;
  betterAuthId: string;
}

interface MediumSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export function MediumSidebar({
  isMobile = false,
  onClose,
}: MediumSidebarProps) {
  const { user } = useAuth();
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("following", following);

  useEffect(() => {
    if (user) {
      fetchFollowing();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchFollowing = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user?.id}/following-users`
      );
      if (response.ok) {
        const data = await response.json();
        setFollowing(data.following || []);
      }
    } catch (error) {
      console.error("Failed to fetch following:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    {
      icon: Bookmark,
      label: "My Content",
      href: "/my-content",
    },
    {
      icon: User,
      label: "Profile",
      href: user ? `/profile/${user.id}` : "/auth/login",
    },
    { icon: BarChart3, label: "Stats", href: "/library/stats" },
  ];

  return (
    <aside
      className={`${
        isMobile ? "w-full h-full" : "w-72 md:h-fit sticky top-0"
      } bg-background overflow-y-auto`}
    >
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start h-10 px-3"
            asChild
            onClick={isMobile ? onClose : undefined}
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Link>
          </Button>
        ))}

        {/* Following Section */}
        <div className="pt-6 mt-4 border-t">
          <div className="flex items-center justify-between px-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-sm">Following</span>
            </div>
            {following.length > 0 && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                {following.length}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-md animate-pulse"
                  >
                    <div className="h-8 w-8 bg-muted rounded-full" />
                    <div className="flex-1 h-4 bg-muted rounded w-24" />
                  </div>
                ))}
              </div>
            ) : following.length === 0 ? (
              <div className="px-3 py-6 text-center">
                <div className="p-3 rounded-lg bg-muted/50 mb-3 inline-block">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Not following anyone yet
                </p>
                <Button variant="outline" size="sm" asChild className="text-xs">
                  <Link href="/search">Discover People</Link>
                </Button>
              </div>
            ) : (
              <>
                {following.slice(0, 8).map((followedUser) => (
                  <Link
                    key={followedUser._id}
                    href={`/profile/${followedUser.betterAuthId}`}
                    onClick={isMobile ? onClose : undefined}
                    className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-primary/5 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="h-8 w-8 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                        <AvatarImage src={followedUser.avatar} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                          {followedUser.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {followedUser.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {followedUser.email.split("@")[0]}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </Link>
                ))}

                {following.length > 8 && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full text-xs mt-2 gap-1"
                  >
                    <Link href="/search">View all {following.length} →</Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}
