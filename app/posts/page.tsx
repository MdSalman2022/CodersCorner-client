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
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 bg-muted rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-3 bg-muted rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <div className="h-5 bg-muted rounded w-16"></div>
                      <div className="h-5 bg-muted rounded w-20"></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-muted rounded w-8"></div>
                      <div className="h-4 bg-muted rounded w-8"></div>
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
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Latest Posts</h1>
              <p className="text-muted-foreground mt-1">
                Discover amazing stories from our community
              </p>
            </div>
            {user && (
              <Link href="/write">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Write Post
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">No posts yet</h2>
            <p className="text-muted-foreground mb-6">
              Be the first to share your knowledge with the community!
            </p>
            {user ? (
              <Link href="/write">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Write Your First Post
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button>Sign In to Write</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Card
                key={post._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.author?.avatar} />
                      <AvatarFallback>
                        {post.author?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">
                        <Link
                          href={`/profile/${post.author?.userId}`}
                          className="hover:text-primary transition-colors"
                        >
                          {post.author?.name || "Anonymous"}
                        </Link>
                      </p>
                      <p className="text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString()} •{" "}
                        {post.readingTime} min read
                      </p>
                    </div>
                  </div>
                  <CardTitle className="text-xl hover:text-primary cursor-pointer">
                    <Link href={`/posts/${post._id}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
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
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{post.likes.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{post.comments.length}</span>
                      </div>
                      <Button variant="ghost" size="sm">
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
