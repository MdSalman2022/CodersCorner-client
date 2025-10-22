"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Calendar,
  Users,
  FileText,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface UserStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  followersCount: number;
  followingCount: number;
  postsThisMonth: number;
  viewsThisMonth: number;
}

export default function StatsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isFetchingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Wait for auth to complete first
    if (authLoading) {
      console.log("⏳ Waiting for auth to complete...");
      return;
    }

    // Only run once after auth loads
    if (hasInitializedRef.current) {
      return;
    }

    if (user?.id) {
      console.log("✅ Auth complete, initializing stats fetch");
      hasInitializedRef.current = true;
      fetchStats();
    } else {
      // User not logged in, stop loading
      console.log("❌ No user found after auth complete");
      hasInitializedRef.current = true;
      setLoading(false);
    }

    // Cleanup function to abort fetch on unmount
    return () => {
      if (abortControllerRef.current) {
        console.log("🛑 Aborting stats fetch request");
        abortControllerRef.current.abort();
      }
    };
  }, [user?.id, authLoading]);

  const fetchStats = async () => {
    // Prevent duplicate requests
    if (isFetchingRef.current) {
      console.log(
        "⚠️ Stats fetch already in progress, skipping duplicate request"
      );
      return;
    }

    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      // Abort previous request if exists
      if (abortControllerRef.current) {
        console.log("🛑 Canceling previous stats fetch");
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      isFetchingRef.current = true;

      console.log("🔄 Fetching stats for user:", user.id);

      // Fetch user stats
      const userStatsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/stats/user/${user.id}`,
        {
          signal: abortControllerRef.current.signal,
        }
      );

      if (userStatsResponse.ok) {
        const userStatsData = await userStatsResponse.json();

        // Fetch post stats for this month
        const postStatsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/stats/posts?userId=${user.id}&timeRange=month`,
          {
            signal: abortControllerRef.current.signal,
          }
        );

        let postsThisMonth = 0;
        let viewsThisMonth = 0;

        if (postStatsResponse.ok) {
          const postStatsData = await postStatsResponse.json();
          postsThisMonth = postStatsData.posts?.length || 0;
          viewsThisMonth = postStatsData.summary?.totalViews || 0;
        }

        // Combine all stats
        const combinedStats: UserStats = {
          totalPosts: userStatsData.stats?.totalPosts || 0,
          totalViews: userStatsData.stats?.totalViews || 0,
          totalLikes: userStatsData.stats?.totalLikes || 0,
          totalComments: userStatsData.stats?.totalComments || 0,
          followersCount: userStatsData.stats?.followers || 0,
          followingCount: userStatsData.stats?.following || 0,
          postsThisMonth,
          viewsThisMonth,
        };

        console.log("✅ Stats fetched successfully:", combinedStats);
        setStats(combinedStats);
      }
    } catch (error: unknown) {
      // Ignore abort errors - they're expected when cleaning up
      if (error instanceof Error && error.name === "AbortError") {
        console.log("ℹ️ Stats fetch aborted (this is normal on cleanup)");
      } else {
        console.error("Failed to fetch stats:", error);
      }
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  // Show loading while auth is loading OR stats are loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // After auth and stats load, check if user exists
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Sign in to view your reading and writing statistics.
            </p>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
                Sign In
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8" />
              Your Statistics
            </h1>
            <p className="text-muted-foreground">
              Track your writing and reading activity
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Posts
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.postsThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalViews.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.viewsThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Likes
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalLikes}</div>
                <p className="text-xs text-muted-foreground">From your posts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.followersCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  People following you
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Writing Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Writing Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Posts Published
                  </span>
                  <Badge variant="secondary">{stats?.totalPosts}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Views
                  </span>
                  <Badge variant="secondary">
                    {stats?.totalViews.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Likes
                  </span>
                  <Badge variant="secondary">{stats?.totalLikes}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Comments Received
                  </span>
                  <Badge variant="secondary">{stats?.totalComments}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Reading Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Reading Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Following
                  </span>
                  <Badge variant="secondary">{stats?.followingCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Followers
                  </span>
                  <Badge variant="secondary">{stats?.followersCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Topics Followed
                  </span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Reading Streak
                  </span>
                  <Badge variant="secondary">7 days</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Published a new story</p>
                    <p className="text-sm text-muted-foreground">
                      "Getting Started with React Hooks" • 2 days ago
                    </p>
                  </div>
                  <Badge variant="secondary">+12 views</Badge>
                </div>

                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Received likes</p>
                    <p className="text-sm text-muted-foreground">
                      5 people liked your story • 3 days ago
                    </p>
                  </div>
                  <Badge variant="secondary">+5 likes</Badge>
                </div>

                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">New follower</p>
                    <p className="text-sm text-muted-foreground">
                      Sarah Johnson started following you • 5 days ago
                    </p>
                  </div>
                  <Badge variant="secondary">+1 follower</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
