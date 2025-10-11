"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, Heart, MessageCircle, Clock } from "lucide-react";
import { Header } from "@/components/header";

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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/search?q=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (response.ok) {
        const posts = await response.json();
        setResults(posts);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search Header */}
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Discover Stories</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Search through thousands of articles, tutorials, and insights from our developer community
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for posts, topics, authors, or keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-2xl border-2 focus:border-primary shadow-lg"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full mt-4 rounded-2xl shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search Stories
                </>
              )}
            </Button>
          </form>

          {/* Search Results */}
          {searched && (
            <div className="space-y-8">
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-lg text-muted-foreground">Searching through stories...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No stories found</h3>
                  <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
                    We couldn't find any posts matching "{query}". Try different keywords or browse popular topics below.
                  </p>
                  <Button variant="outline" onClick={() => setSearched(false)}>
                    Browse Topics
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-center bg-muted/50 rounded-2xl p-6">
                    <p className="text-lg text-muted-foreground">
                      Found <span className="font-semibold text-primary">{results.length}</span> story
                      {results.length !== 1 ? "ies" : "y"} for <span className="font-semibold">"{query}"</span>
                    </p>
                  </div>

                  <div className="space-y-6">
                    {results.map((post) => (
                      <Card
                        key={post._id}
                        className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                              <AvatarImage src={post.author.avatar} />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {post.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold text-sm hover:text-primary transition-colors cursor-pointer">
                                <Link href={`/profile/${post.author.userId}`}>
                                  {post.author.name}
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
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Popular Topics */}
          {!searched && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-3">Explore Popular Topics</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Discover trending technologies and frameworks that developers are talking about
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { name: "JavaScript", color: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20" },
                  { name: "React", color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20" },
                  { name: "Next.js", color: "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20" },
                  { name: "TypeScript", color: "bg-blue-600/10 text-blue-700 hover:bg-blue-600/20" },
                  { name: "Python", color: "bg-green-500/10 text-green-600 hover:bg-green-500/20" },
                  { name: "Node.js", color: "bg-green-600/10 text-green-700 hover:bg-green-600/20" },
                  { name: "CSS", color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20" },
                  { name: "HTML", color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20" },
                  { name: "Git", color: "bg-red-500/10 text-red-600 hover:bg-red-500/20" },
                  { name: "Docker", color: "bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20" },
                  { name: "AWS", color: "bg-orange-600/10 text-orange-700 hover:bg-orange-600/20" },
                  { name: "MongoDB", color: "bg-green-600/10 text-green-700 hover:bg-green-600/20" },
                  { name: "PostgreSQL", color: "bg-blue-700/10 text-blue-800 hover:bg-blue-700/20" },
                  { name: "GraphQL", color: "bg-pink-500/10 text-pink-600 hover:bg-pink-500/20" },
                  { name: "REST API", color: "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20" },
                ].map((topic) => (
                  <Button
                    key={topic.name}
                    variant="outline"
                    onClick={() => {
                      setQuery(topic.name);
                      handleSearch(topic.name);
                    }}
                    className={`h-auto p-4 rounded-xl border-2 hover:border-primary transition-all duration-200 ${topic.color} hover:shadow-lg`}
                  >
                    <div className="text-center">
                      <div className="font-semibold text-sm">{topic.name}</div>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Trending Searches */}
              <div className="bg-muted/50 rounded-2xl p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">Trending This Week</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {[
                    "AI in Web Development",
                    "Modern React Patterns",
                    "TypeScript Best Practices",
                    "Serverless Architecture",
                    "DevOps for Startups"
                  ].map((trend) => (
                    <Button
                      key={trend}
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setQuery(trend);
                        handleSearch(trend);
                      }}
                      className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {trend}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
