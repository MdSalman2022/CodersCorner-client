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
import { Button } from "@/components/ui/button";
import { Code, Heart, MessageCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  publishedAt: string;
  readingTime?: number;
  likes: string[];
  comments: string[];
  views: number;
  isFeatured: boolean;
}

export function FeaturedPosts() {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  const fetchFeaturedPosts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?featured=true&limit=3`
      );
      if (response.ok) {
        const data = await response.json();
        setFeaturedPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Failed to fetch featured posts:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("featuredPosts", featuredPosts);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Loading featured content...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (featuredPosts.length === 0) {
    return (
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the most engaging articles from our community this week
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Main Featured Post - Placeholder */}
            <Card className="lg:col-span-2 hover:shadow-xl transition-all duration-300 border-0 shadow-lg group cursor-pointer">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center">
                <Code className="h-16 w-16 text-primary/60" />
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">CC</span>
                  </div>
                  <div>
                    <p className="font-medium">Coders Corner</p>
                    <p className="text-sm text-muted-foreground">
                      Coming Soon • 5 min read
                    </p>
                  </div>
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  Featured Content Coming Soon
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  We're working on bringing you the best developer stories.
                  Check back soon for featured articles from our community.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Side Posts - Placeholders */}
            <div className="space-y-6">
              {[1, 2].map((index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                        <span className="text-secondary-foreground font-semibold text-sm">
                          CC
                        </span>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Coders Corner</p>
                        <p className="text-muted-foreground">Coming Soon</p>
                      </div>
                    </div>
                    <CardTitle className="text-lg">
                      More Featured Content Soon
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Exciting developer stories and tutorials are on the way!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          Soon
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground text-xs">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />0
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />0
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/posts">
                <Code className="h-5 w-5 mr-2" />
                View All Stories
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Featured Stories</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the most engaging articles from our community this week
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Featured Post */}
          {featuredPosts[0] && (
            <Card className="lg:col-span-2 hover:shadow-xl transition-all duration-300 border-0 shadow-lg group cursor-pointer">
              <Link href={`/posts/${featuredPosts[0]._id}`}>
                {featuredPosts[0].coverImage ? (
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={featuredPosts[0].coverImage}
                      alt={featuredPosts[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center">
                    <Code className="h-16 w-16 text-primary/60" />
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                      {featuredPosts[0].author.avatar ? (
                        <img
                          src={featuredPosts[0].author.avatar}
                          alt={featuredPosts[0].author.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-primary font-semibold">
                          {featuredPosts[0].author.name[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {featuredPosts[0].author.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          featuredPosts[0].publishedAt
                        ).toLocaleDateString()}{" "}
                        • {featuredPosts[0].readingTime || 5} min read
                      </p>
                    </div>
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {featuredPosts[0].title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {featuredPosts[0].excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {featuredPosts[0].tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">
                          {featuredPosts[0].likes.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">
                          {featuredPosts[0].comments.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          )}

          {/* Side Posts */}
          <div className="space-y-6">
            {featuredPosts.slice(1, 3).map((post) => (
              <Card
                key={post._id}
                className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm group cursor-pointer"
              >
                <Link href={`/posts/${post._id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center overflow-hidden">
                        {post.author.avatar ? (
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-secondary-foreground font-semibold text-sm">
                            {post.author.name[0]}
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{post.author.name}</p>
                        <p className="text-muted-foreground">
                          {post.readingTime || 5} min read
                        </p>
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground text-xs">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes.length}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.comments.length}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/posts">
              <Code className="h-5 w-5 mr-2" />
              View All Stories
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
