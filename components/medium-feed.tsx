"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  MessageCircle,
  Clock,
  Bookmark,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
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
  views: number;
  coverImage?: string;
  updatedAt?: string;
}

export function MediumFeed() {
  const { user } = useAuth();
  const [discoverPosts, setDiscoverPosts] = useState<Post[]>([]);
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscoverPosts();
    if (user) {
      fetchFollowingPosts();
    }
  }, [user]);

  const fetchDiscoverPosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/posts?limit=20");
      if (response.ok) {
        const data = await response.json();
        setDiscoverPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch discover posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowingPosts = async () => {
    try {
      // In a real app, this would fetch posts from followed users
      // For now, just fetch recent posts
      const response = await fetch("http://localhost:5000/api/posts?limit=15");
      if (response.ok) {
        const data = await response.json();
        setFollowingPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch following posts:", error);
    }
  };

  const PostCard = ({ post }: { post: Post }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {post.author.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Link
              href={`/profile/${post.author.userId}`}
              className="font-semibold text-sm hover:text-primary transition-colors"
            >
              {post.author.name}
            </Link>
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
        <p className="text-muted-foreground line-clamp-3 text-base">
          {post.excerpt}
        </p>
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
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 hover:text-red-500"
            >
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-sm">{post.likes.length}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 hover:text-blue-500"
            >
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
  );

  if (loading) {
    return (
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-48"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
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
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8">
      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="following" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Following
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-8">
            {discoverPosts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No stories yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to share your knowledge with the community!
                  </p>
                </CardContent>
              </Card>
            ) : (
              discoverPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            )}
          </TabsContent>

          <TabsContent value="following" className="space-y-8">
            {!user ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Sign in to see following
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Follow developers and topics to see their latest stories
                    here.
                  </p>
                  <Button asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : followingPosts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No stories from following
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Follow some developers or topics to see their stories here.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/search">Discover People & Topics</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              followingPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
