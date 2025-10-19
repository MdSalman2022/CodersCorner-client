"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  FileText,
  Heart,
  MessageCircle,
  Clock,
  UserPlus,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

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
  coverImage?: string;
  updatedAt?: string;
}

interface TopicData {
  name: string;
  followers: number;
  description: string;
  posts: Post[];
  isFollowing: boolean;
}

export default function TopicPage() {
  const { topic } = useParams();
  const [topicData, setTopicData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topic) {
      fetchTopicData();
    }
  }, [topic]);

  const fetchTopicData = async () => {
    try {
      setLoading(true);
      // For now, simulate topic data
      const mockTopicData: TopicData = {
        name: decodeURIComponent(topic as string),
        followers: Math.floor(Math.random() * 10000) + 1000,
        description: `Everything about ${decodeURIComponent(
          topic as string
        )}. Discover the latest trends, tutorials, and insights from the developer community.`,
        isFollowing: Math.random() > 0.5,
        posts: [], // Will be populated from API
      };

      // Fetch posts with this topic/tag
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/api/posts?tag=${encodeURIComponent(topic as string)}&limit=20`
      );
      if (response.ok) {
        const data = await response.json();
        mockTopicData.posts = data.posts;
      }

      setTopicData(mockTopicData);
    } catch (error) {
      console.error("Failed to fetch topic data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!topicData) return;

    // In a real app, this would make an API call
    setTopicData({
      ...topicData,
      isFollowing: !topicData.isFollowing,
      followers: topicData.isFollowing
        ? topicData.followers - 1
        : topicData.followers + 1,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse space-y-8 p-8">
          <div className="h-32 bg-muted rounded"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!topicData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Topic Header */}
      <div className="border-b bg-gradient-to-r from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="max-w-4xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{topicData.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {topicData.description}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {topicData.followers.toLocaleString()} followers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{topicData.posts.length} stories</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleFollow}
                variant={topicData.isFollowing ? "outline" : "default"}
                className="flex items-center gap-2"
              >
                {topicData.isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Follow
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stories */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">Latest Stories</h2>

          {topicData.posts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No stories yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to write about {topicData.name}!
                </p>
                <Button asChild>
                  <Link href="/write">Write a Story</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {topicData.posts.map((post) => (
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
