"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Eye,
  BookOpen,
  Heart,
  MessageCircle,
  Users,
  TrendingUp,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface PostStats {
  _id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  reads: number;
  createdAt: string;
}

interface UserStats {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalReads: number;
  followers: number;
  following: number;
  totalPosts: number;
  averageViews: number;
}

export default function StatsPage() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [postStats, setPostStats] = useState<PostStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");

  useEffect(() => {
    if (user) {
      fetchStats();
    } else {
      window.location.href = "/auth/login";
    }
  }, [user, timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const userStatsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/stats/user/${user?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (userStatsResponse.ok) {
        const userData = await userStatsResponse.json();
        setUserStats(userData.stats);
      }

      const postStatsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/stats/posts?userId=${user?.id}&timeRange=${timeRange}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (postStatsResponse.ok) {
        const postData = await postStatsResponse.json();
        setPostStats(postData.posts || []);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleExportStats = async () => {
    try {
      const data = {
        userStats,
        postStats,
        exportedAt: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `stats-${new Date().getTime()}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Stats exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export stats");
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = userStats || {
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalReads: 0,
    followers: 0,
    following: 0,
    totalPosts: 0,
    averageViews: 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8" />
              Your Statistics
            </h1>
            <p className="text-muted-foreground">
              Track your writing performance and audience engagement
            </p>
          </div>
          <Button
            onClick={handleExportStats}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Total Views</span>
                <Eye className="h-4 w-4 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-xs text-muted-foreground">
                {stats.averageViews} avg per post
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Total Reads</span>
                <BookOpen className="h-4 w-4 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReads}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalPosts} posts published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Likes & Hearts</span>
                <Heart className="h-4 w-4 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLikes}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalComments} comments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Your Audience</span>
                <Users className="h-4 w-4 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.followers}</div>
              <p className="text-xs text-muted-foreground">
                Following {stats.following}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Time Range Selection and Post Stats */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Post Performance</h2>
            <Tabs
              value={timeRange}
              onValueChange={(val) => setTimeRange(val as any)}
            >
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="all">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {postStats.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No post data available
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start writing and publish posts to see statistics!
                </p>
                <Button asChild>
                  <Link href="/write">Write Your First Post</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {postStats.map((post) => (
                <Card
                  key={post._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <Link href={`/posts/${post._id}`}>
                          <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Published{" "}
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Views
                            </p>
                            <p className="text-xl font-bold">{post.views}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Reads
                            </p>
                            <p className="text-xl font-bold">{post.reads}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Likes
                            </p>
                            <p className="text-xl font-bold">{post.likes}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 md:col-span-2">
                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Comments
                            </p>
                            <p className="text-xl font-bold">{post.comments}</p>
                          </div>
                        </div>
                      </div>

                      {/* Engagement Rate */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Engagement Rate
                          </p>
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{
                                width: `${Math.min(
                                  ((post.likes + post.comments) / post.views) *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {post.views > 0
                            ? (
                                ((post.likes + post.comments) / post.views) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Pro Tips to Boost Your Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Write eye-catching titles that spark curiosity</li>
              <li>• Use relevant tags to reach your target audience</li>
              <li>• Include engaging visuals and cover images</li>
              <li>• Write posts regularly to build audience loyalty</li>
              <li>• Respond to comments to boost engagement</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
