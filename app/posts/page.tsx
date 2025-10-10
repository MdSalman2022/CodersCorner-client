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
import { Clock, Heart, MessageCircle, Bookmark } from "lucide-react";
import { Header } from "@/components/header";

export default function Posts() {
  // Mock data - will be replaced with real data later
  const posts = [
    {
      id: 1,
      title: "Getting Started with Next.js 14",
      excerpt:
        "Learn how to build modern web applications with Next.js 14's new features...",
      author: { name: "John Doe", avatar: "/avatars/01.png" },
      publishedAt: "2024-01-15",
      readTime: "5 min read",
      tags: ["Next.js", "React", "JavaScript"],
      likes: 42,
      comments: 8,
    },
    {
      id: 2,
      title: "Mastering TypeScript Interfaces",
      excerpt:
        "Deep dive into TypeScript interfaces and how to use them effectively...",
      author: { name: "Jane Smith", avatar: "/avatars/02.png" },
      publishedAt: "2024-01-14",
      readTime: "7 min read",
      tags: ["TypeScript", "JavaScript"],
      likes: 28,
      comments: 12,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Posts Feed */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{post.author.name}</p>
                    <p className="text-muted-foreground">
                      {post.publishedAt} • {post.readTime}
                    </p>
                  </div>
                </div>
                <CardTitle className="text-xl hover:text-primary cursor-pointer">
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription className="text-base">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{post.comments}</span>
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
      </main>
    </div>
  );
}
