"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, Heart, MessageCircle, Bookmark, Plus } from "lucide-react";
import { Header } from "@/components/header";
import { useAuth } from "@/lib/auth-context";

interface Post {
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
  comments: any[];
}

export default function Posts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      } else {
        setError("Failed to load posts");
      }
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-48"></div>
                    </div>
                  </div>
                  <div className="h-7 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/6"></div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="h-6 bg-muted rounded-full w-16"></div>
                      <div className="h-6 bg-muted rounded-full w-20"></div>
                      <div className="h-6 bg-muted rounded-full w-14"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-4 bg-muted rounded w-8"></div>
                      <div className="h-4 bg-muted rounded w-8"></div>
                      <div className="h-4 bg-muted rounded w-6"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Posts</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchPosts}>Try Again</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header with Write Button */}
      <div className="border-b bg-gradient-to-r from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Latest Stories</h1>
              <p className="text-xl text-muted-foreground">
                Discover amazing insights from our developer community
              </p>
            </div>
            {user && (
              <Button size="lg" className="shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                Write Story
              </Button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { label: "All Topics", active: true },
              { label: "Trending", active: false },
              { label: "Latest", active: false },
              { label: "Following", active: false },
            ].map((filter) => (
              <Button
                key={filter.label}
                variant={filter.active ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-3">No stories yet</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
              Be the first to share your knowledge and insights with the developer community!
            </p>
            {user ? (
              <Button size="lg" className="shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                Write Your First Story
              </Button>
            ) : (
              <div className="space-y-4">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">Join the Community</Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Card
                key={post._id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                      <AvatarImage src={post.author?.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {post.author?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-sm hover:text-primary transition-colors cursor-pointer">
                        <Link href={`/profile/${post.author?.userId}`}>
                          {post.author?.name || "Anonymous"}
                        </Link>
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readingTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors cursor-pointer leading-tight">
                    <Link href={`/posts/${post._id}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <Button variant="ghost" size="sm" className="h-8 px-2 hover:text-red-500">
                        <Heart className="h-4 w-4 mr-1" />
                        <span className="text-sm">{post.likes.length}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 hover:text-blue-500">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">{post.comments.length}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
