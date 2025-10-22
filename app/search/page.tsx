"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
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
  isFeatured: boolean;
  coverImage?: string;
  updatedAt?: string;
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [trendingTags, setTrendingTags] = useState<string[]>([]);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
    // Fetch trending tags on component mount
    fetchTrendingTags();
  }, [initialQuery]);

  const fetchTrendingTags = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts/trending-tags`
      );
      if (response.ok) {
        const tags = await response.json();
        // Get top 5 tags
        setTrendingTags(tags.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch trending tags:", error);
    }
  };

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/api/posts/search?q=${encodeURIComponent(searchQuery)}`
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

  const handleTagClick = (tag: string) => {
    // Navigate to topic page with the tag (uses medium right sidebar UI)
    router.push(`/topic/${encodeURIComponent(tag)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Discover Stories</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Search through thousands of articles, tutorials, and insights from
              our developer community
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
                  <p className="text-lg text-muted-foreground">
                    Searching through stories...
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No stories found</h3>
                  <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
                    We couldn't find any posts matching "{query}". Try different
                    keywords or browse popular topics below.
                  </p>
                  <Button variant="outline" onClick={() => setSearched(false)}>
                    Browse Topics
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-center bg-muted/50 rounded-2xl p-6">
                    <p className="text-lg text-muted-foreground">
                      Found{" "}
                      <span className="font-semibold text-primary">
                        {results.length}
                      </span>{" "}
                      story
                      {results.length !== 1 ? "ies" : "y"} for{" "}
                      <span className="font-semibold">"{query}"</span>
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
                                <span>
                                  {new Date(
                                    post.publishedAt
                                  ).toLocaleDateString()}
                                </span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{post.readingTime} min read</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors cursor-pointer leading-tight">
                            <Link href={`/posts/${post._id}`}>
                              {post.title}
                            </Link>
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 hover:text-red-500"
                              >
                                <Heart className="h-4 w-4 mr-1" />
                                <span className="text-sm">
                                  {post.likes.length}
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 hover:text-blue-500"
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                <span className="text-sm">
                                  {post.comments.length}
                                </span>
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
                <h2 className="text-3xl font-bold mb-3">
                  Explore Trending Topics
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Discover what developers are talking about this week
                </p>
              </div>

              {trendingTags.length > 0 ? (
                <div className="flex flex-wrap gap-3 justify-center">
                  {trendingTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 transform hover:scale-105"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Loading trending topics...
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
