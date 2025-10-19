"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Heart,
  MessageCircle,
  Clock,
  Bookmark,
  PenTool,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useBookmarks } from "@/lib/bookmark-context";
import { toast } from "sonner";

interface SavedPost {
  _id: string;
  title: string;
  excerpt: string;
  author: {
    userId: string;
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readingTime: number;
  tags: string[];
  likes: string[];
  comments: { _id: string }[];
}

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
  comments?: { _id: string }[];
  tags: string[];
}

export default function LibraryPage() {
  const { user } = useAuth();
  const { removeBookmark } = useBookmarks();
  const [activeTab, setActiveTab] = useState<
    "bookmarks" | "published" | "draft"
  >("bookmarks");
  const [bookmarkedPosts, setBookmarkedPosts] = useState<SavedPost[]>([]);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (activeTab === "bookmarks") {
        fetchBookmarkedPosts();
      } else {
        fetchUserPosts();
      }
    }
  }, [user, activeTab]);

  const fetchBookmarkedPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookmarks?userId=${user?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBookmarkedPosts(data.bookmarks || []);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch bookmarked posts:", error);
      toast.error("Failed to load bookmarks");
    }
  };

  const fetchUserPosts = async () => {
    try {
      const status = activeTab === "published" ? "published" : "draft";
      const response = await fetch(
        `http://localhost:5000/api/posts?status=${status}&userId=${user?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
      toast.error("Failed to load posts");
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
        setUserPosts(userPosts.filter((p) => p._id !== postId));
        toast.success("Post deleted successfully");
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete post");
    }
  };

  const handleRemoveBookmark = async (postId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookmarks/${postId}?userId=${user?.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Update context
        removeBookmark(postId);
        // Update local state
        setBookmarkedPosts(bookmarkedPosts.filter((p) => p._id !== postId));
        toast.success("Bookmark removed");
      } else {
        toast.error("Failed to remove bookmark");
      }
    } catch (error) {
      console.error("Remove bookmark error:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Library
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Sign in to access your personal library of saved stories.
            </p>
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
              <BookOpen className="h-8 w-8" />
              Your Library
            </h1>
            <p className="text-muted-foreground">
              Manage your saved stories and published/draft posts
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as any)}
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>

            {/* Bookmarks Tab */}
            <TabsContent value="bookmarks" className="space-y-6">
              {bookmarkedPosts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No bookmarks yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Save stories you want to read later by clicking the
                      bookmark icon.
                    </p>
                    <Button asChild>
                      <Link href="/">Discover Stories</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bookmarkedPosts.map((post) => (
                    <Card
                      key={post._id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={post.author.avatar} />
                                <AvatarFallback>
                                  {post.author.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <Link
                                  href={`/profile/${post.author.userId}`}
                                  className="font-medium hover:text-primary transition-colors"
                                >
                                  {post.author.name}
                                </Link>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>
                                    {new Date(
                                      post.publishedAt
                                    ).toLocaleDateString()}
                                  </span>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{post.readingTime} min read</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveBookmark(post._id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>

                          <div>
                            <Link href={`/posts/${post._id}`}>
                              <h3 className="text-xl font-semibold hover:text-primary transition-colors mb-2">
                                {post.title}
                              </h3>
                            </Link>
                            {post.excerpt && (
                              <p className="text-muted-foreground line-clamp-3">
                                {post.excerpt}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between flex-wrap gap-4">
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

                            <div className="flex items-center gap-4 text-muted-foreground">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                              >
                                <Heart className="h-4 w-4 mr-1" />
                                <span className="text-sm">
                                  {post.likes.length}
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                <span className="text-sm">
                                  {post.comments.length}
                                </span>
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

            {/* Published Tab */}
            <TabsContent value="published" className="space-y-6">
              {userPosts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <PenTool className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No published posts yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start writing and publishing your first story!
                    </p>
                    <Button asChild>
                      <Link href="/write">Create New Post</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <Card
                      key={post._id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <Badge className="mb-2">
                                {post.status.charAt(0).toUpperCase() +
                                  post.status.slice(1)}
                              </Badge>
                              <Link href={`/posts/${post._id}`}>
                                <h3 className="text-xl font-semibold hover:text-primary transition-colors mb-2">
                                  {post.title}
                                </h3>
                              </Link>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/write?id=${post._id}`}>Edit</Link>
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

                          {post.excerpt && (
                            <p className="text-muted-foreground line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}

                          <div className="flex items-center justify-between flex-wrap gap-4">
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

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                {new Date(
                                  post.publishedAt || post.createdAt
                                ).toLocaleDateString()}
                              </span>
                              {post.views && (
                                <>
                                  <span>•</span>
                                  <span>{post.views} views</span>
                                </>
                              )}
                              {post.likes && (
                                <>
                                  <span>•</span>
                                  <span>{post.likes.length} likes</span>
                                </>
                              )}
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
              {userPosts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <PenTool className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No drafts yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start writing a new story and save it as a draft!
                    </p>
                    <Button asChild>
                      <Link href="/write">Create New Post</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <Card
                      key={post._id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <Badge variant="outline" className="mb-2">
                                Draft
                              </Badge>
                              <Link href={`/write?id=${post._id}`}>
                                <h3 className="text-xl font-semibold hover:text-primary transition-colors mb-2">
                                  {post.title}
                                </h3>
                              </Link>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/write?id=${post._id}`}>
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

                          {post.excerpt && (
                            <p className="text-muted-foreground line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}

                          <div className="flex items-center justify-between flex-wrap gap-4">
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

                            <div className="text-sm text-muted-foreground">
                              Last updated:{" "}
                              {new Date(post.updatedAt).toLocaleDateString()}
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
      </div>
    </div>
  );
}
