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
  commentsCount: number;
  lastActivity: string;
}

interface Topic {
  name: string;
  followers: number;
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
      // Get posts with most comments, sorted by recent activity
      const response = await fetch(
        "http://localhost:5000/api/posts?limit=5&sort=comments"
      );
      if (response.ok) {
        const data = await response.json();
        // Transform to discussion format
        const discussionPosts = data.posts
          .map((post: any) => ({
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
    // Static recommended topics for now
    const recommendedTopics: Topic[] = [
      { name: "JavaScript", followers: 12500, color: "bg-yellow-500" },
      { name: "React", followers: 8900, color: "bg-blue-500" },
      { name: "Python", followers: 15600, color: "bg-green-500" },
      { name: "TypeScript", followers: 7800, color: "bg-blue-600" },
      { name: "Node.js", followers: 9200, color: "bg-green-600" },
      { name: "CSS", followers: 11300, color: "bg-purple-500" },
      { name: "AWS", followers: 6700, color: "bg-orange-500" },
      { name: "Docker", followers: 5400, color: "bg-cyan-500" },
    ];
    setTopics(recommendedTopics);
    setLoading(false);
  };

  return (
    <aside
      className={
        isMobile
          ? "w-full"
          : "w-80 h-screen sticky top-16 border-l bg-background p-6 overflow-y-auto"
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
              Recommended Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Link
                  key={topic.name}
                  href={`/topic/${encodeURIComponent(
                    topic.name.toLowerCase()
                  )}`}
                >
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1"
                  >
                    {topic.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
