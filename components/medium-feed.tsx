"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { BookmarkButton } from "@/components/bookmark-button";

interface Comment {
  _id: string;
  content: string;
  author: string;
}

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
  comments: Comment[];
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?limit=20&sort=trending`
      );
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
      if (!user) return;

      console.log("🔄 Fetching following posts for user:", user.id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts/feed/following?limit=15`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id || user.betterAuthId,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Following posts fetched:", data.posts.length);
        setFollowingPosts(data.posts);
      } else {
        console.error("Failed to fetch following posts:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch following posts:", error);
    }
  };

  const PostCard = ({ post }: { post: Post }) => (
    <div className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer group">
      <div className="px-4 py-3 md:px-6 md:py-4">
        {/* Author Info */}
        <div className="flex items-start gap-3 mb-3">
          <Link href={`/profile/${post.author.userId}`}>
            <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-primary/10">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {post.author.name[0]}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/profile/${post.author.userId}`}
                className="font-semibold hover:underline"
              >
                {post.author.name}
              </Link>
              <span className="text-sm text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <Link href={`/posts/${post._id}`} className="block mb-3">
          <h2 className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-muted-foreground line-clamp-2 text-sm md:text-base">
            {post.excerpt}
          </p>
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs hover:bg-primary/20 transition-colors"
              >
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between text-muted-foreground pt-2 border-t border-border/50">
          {/* Left: Like and Comment with Links */}
          <div className="flex items-center gap-6">
            {/* Likes */}
            <Link
              href={`/posts/${post._id}`}
              className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
            >
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-xs font-medium">{post.likes.length}</span>
            </Link>

            {/* Comments */}
            <Link
              href={`/posts/${post._id}#comments`}
              className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs font-medium">
                {post.comments.length}
              </span>
            </Link>
          </div>

          {/* Right: Bookmark */}
          <div className="flex items-center gap-1">
            <BookmarkButton postId={post._id} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <main className="flex-1 border-x">
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="px-4 py-3 md:px-6 md:py-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 md:h-12 md:w-12 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-3 bg-muted rounded w-48"></div>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="h-5 md:h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex gap-4">
                  <div className="h-4 bg-muted rounded w-8"></div>
                  <div className="h-4 bg-muted rounded w-8"></div>
                </div>
                <div className="h-4 bg-muted rounded w-6"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 border-x">
      <div className="divide-y">
        <Tabs defaultValue="discover" className="w-full">
          {/* Sticky Tab Header */}
          <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b">
            <TabsList className="grid w-full grid-cols-2 mb-0 rounded-none bg-transparent">
              <TabsTrigger
                value="discover"
                className="flex items-center justify-center gap-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Discover</span>
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="flex items-center justify-center gap-2 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Following</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Discover Tab */}
          <TabsContent value="discover" className="mt-0">
            {discoverPosts.length === 0 ? (
              <div className="px-4 py-12 md:px-6 text-center">
                <TrendingUp className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-base md:text-lg font-semibold mb-2">
                  No stories yet
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Be the first to share your knowledge with the community!
                </p>
              </div>
            ) : (
              discoverPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            )}
          </TabsContent>

          {/* Following Tab */}
          <TabsContent value="following" className="mt-0">
            {!user ? (
              <div className="px-4 py-12 md:px-6 text-center">
                <Users className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-base md:text-lg font-semibold mb-2">
                  Sign in to see following
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  Follow developers and topics to see their latest stories here.
                </p>
                <Button asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            ) : followingPosts.length === 0 ? (
              <div className="px-4 py-12 md:px-6 text-center">
                <Users className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-base md:text-lg font-semibold mb-2">
                  No stories from following
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  Follow some developers or topics to see their stories here.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/search">Discover People & Topics</Link>
                </Button>
              </div>
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
