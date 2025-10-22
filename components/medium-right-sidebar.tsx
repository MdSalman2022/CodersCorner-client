"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

interface DiscussionPost {
  _id: string;
  title: string;
  author: {
    name: string;
    avatar?: string;
    userId: string;
  };
  comments?: string[];
  commentsCount: number;
  lastActivity: string;
  updatedAt?: string;
  createdAt?: string;
}

interface Post {
  _id: string;
  title: string;
  author: {
    name: string;
    avatar?: string;
    userId: string;
  };
  comments?: string[];
  tags?: string[];
  updatedAt?: string;
  createdAt?: string;
}

interface Topic {
  name: string;
  count: number;
  color: string;
}

interface MediumRightSidebarProps {
  isMobile?: boolean;
}

export function MediumRightSidebar({
  isMobile = false,
}: MediumRightSidebarProps = {}) {
  const [discussions, setDiscussions] = useState<DiscussionPost[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveDiscussions();
    fetchRecommendedTopics();
  }, []);

  const fetchActiveDiscussions = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?limit=5&sort=comments`
      );
      if (response.ok) {
        const data = await response.json();
        const discussionPosts = data.posts
          .map((post: Post) => ({
            _id: post._id,
            title: post.title,
            author: post.author,
            commentsCount: post.comments?.length || 0,
            lastActivity: post.updatedAt || post.createdAt,
          }))
          .sort(
            (a: DiscussionPost, b: DiscussionPost) =>
              new Date(b.lastActivity).getTime() -
              new Date(a.lastActivity).getTime()
          );
        setDiscussions(discussionPosts);
      }
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
    }
  };

  const fetchRecommendedTopics = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?limit=100`
      );
      if (response.ok) {
        const data = await response.json();

        const tagCount: Record<string, number> = {};
        data.posts.forEach((post: Post) => {
          post.tags?.forEach((tag: string) => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          });
        });

        const topicsList: Topic[] = Object.entries(tagCount)
          .map(([name, count]) => ({
            name,
            count,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 12);

        setTopics(topicsList);
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      className={
        isMobile
          ? "w-full"
          : "w-80 h-screen sticky top-0 border-l bg-background p-6 overflow-y-auto"
      }
    >
      <div className={isMobile ? "space-y-6" : "space-y-8"}>
        {/* Active Discussions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Active Discussions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : discussions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active discussions
              </p>
            ) : (
              discussions.map((post) => (
                <div key={post._id} className="space-y-2">
                  <Link
                    href={`/posts/${post._id}`}
                    className="block hover:text-primary transition-colors"
                  >
                    <h4 className="text-sm font-medium line-clamp-2 leading-tight">
                      {post.title}
                    </h4>
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback className="text-xs">
                        {post.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>{post.author.name}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {post.commentsCount}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recommended Topics */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topics.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tags found yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <Link
                    key={topic.name}
                    href={`/topic/${encodeURIComponent(
                      topic.name.toLowerCase()
                    )}`}
                    className="group"
                  >
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1 text-xs"
                      title={`${topic.count} post${
                        topic.count !== 1 ? "s" : ""
                      }`}
                    >
                      {topic.name}
                      <span className="ml-1 opacity-60 group-hover:opacity-100">
                        ({topic.count})
                      </span>
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
