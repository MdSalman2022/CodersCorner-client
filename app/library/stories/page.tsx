"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PenTool,
  Plus,
  Trash2,
  Edit,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface UserPost {
  _id: string;
  title: string;
  excerpt: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views?: number;
  likes?: string[];
  comments?: any[];
  tags: string[];
  coverImage?: string;
}

export default function StoriesPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<UserPost[]>([]);
  const [activeTab, setActiveTab] = useState<"published" | "draft">(
    "published"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    } else {
      window.location.href = "/auth/login";
    }
  }, [user]);

  useEffect(() => {
    const filtered = posts.filter((post) => post.status === activeTab);
    setFilteredPosts(filtered);
  }, [activeTab, posts]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/posts?userId=${user?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setPosts(posts.filter((p) => p._id !== postId));
        toast.success("Post deleted successfully");
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete post");
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <PenTool className="h-8 w-8" />
            My Stories
          </h1>
          <p className="text-muted-foreground">
            Manage all your published and draft posts in one place
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as any)}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="published">
              Published ({posts.filter((p) => p.status === "published").length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts ({posts.filter((p) => p.status === "draft").length})
            </TabsTrigger>
          </TabsList>

          {/* Published Tab */}
          <TabsContent value="published" className="space-y-6">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <PenTool className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No published posts yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Share your first story with the world!
                  </p>
                  <Button asChild>
                    <Link href="/write">Write Your First Post</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredPosts.map((post) => (
                  <Card
                    key={post._id}
                    className="hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <CardContent className="p-0 md:p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Cover Image */}
                        {post.coverImage && (
                          <div className="md:w-48 h-48 md:h-auto overflow-hidden rounded-lg">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Post Details */}
                        <div className="flex-1 p-4 md:p-0 space-y-4">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <Badge className="mb-2">Published</Badge>
                                <Link href={`/posts/${post._id}`}>
                                  <h3 className="text-xl md:text-2xl font-bold hover:text-primary transition-colors">
                                    {post.title}
                                  </h3>
                                </Link>
                              </div>
                            </div>
                            {post.excerpt && (
                              <p className="text-muted-foreground line-clamp-2 mb-4">
                                {post.excerpt}
                              </p>
                            )}
                          </div>

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Stats and Actions */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t">
                            <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                              <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                <span>{post.views || 0} views</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                <span>{post.likes?.length || 0} likes</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" />
                                <span>
                                  {post.comments?.length || 0} comments
                                </span>
                              </div>
                              <span>
                                {new Date(
                                  post.publishedAt || post.createdAt
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/write?id=${post._id}`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeletePost(post._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Draft Tab */}
          <TabsContent value="draft" className="space-y-6">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <PenTool className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No draft posts yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start writing and save your ideas as drafts!
                  </p>
                  <Button asChild>
                    <Link href="/write">Start Writing</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredPosts.map((post) => (
                  <Card
                    key={post._id}
                    className="hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="space-y-4">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            Draft
                          </Badge>
                          <Link href={`/write?id=${post._id}`}>
                            <h3 className="text-xl md:text-2xl font-bold hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                          </Link>
                        </div>

                        {post.excerpt && (
                          <p className="text-muted-foreground line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            Last updated:{" "}
                            {new Date(post.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" asChild>
                              <Link href={`/write?id=${post._id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Continue
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePost(post._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <Button
        asChild
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl"
      >
        <Link href="/write" className="flex items-center gap-2">
          <Plus className="h-6 w-6" />
          <span className="hidden sm:inline">New Post</span>
        </Link>
      </Button>
    </div>
  );
}
