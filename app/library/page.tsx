"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Heart,
  MessageCircle,
  Clock,
  Bookmark,
  Archive,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

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
  comments: any[];
}

export default function LibraryPage() {
  const { user } = useAuth();
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedPosts();
    }
  }, [user]);

  const fetchSavedPosts = async () => {
    try {
      // In a real app, this would fetch user's saved/bookmarked posts
      // For now, just fetch some recent posts as examples
      const response = await fetch("http://localhost:5000/api/posts?limit=10");
      if (response.ok) {
        const data = await response.json();
        setSavedPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch saved posts:", error);
    } finally {
      setLoading(false);
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
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
              <BookOpen className="h-8 w-8" />
              Your Library
            </h1>
            <p className="text-muted-foreground">
              Stories you've saved for later reading
            </p>
          </div>

          {savedPosts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No saved stories yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Save stories you want to read later by clicking the bookmark
                  icon.
                </p>
                <Button asChild>
                  <Link href="/">Discover Stories</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {savedPosts.map((post) => (
                <Card
                  key={post._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
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
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{post.readingTime} min read</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Archive className="h-4 w-4" />
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

                      <div className="flex items-center justify-between">
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
                            <span className="text-sm">{post.likes.length}</span>
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
        </div>
      </div>
    </div>
  );
}
