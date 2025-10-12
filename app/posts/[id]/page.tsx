"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
  Clock,
  Heart,
  MessageCircle,
  Bookmark,
  ArrowLeft,
  Send,
} from "lucide-react";
import { Header } from "@/components/header";
import { useAuth } from "@/lib/auth-context";

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    userId: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  tags: string[];
  category: string;
  publishedAt: string;
  readingTime: number;
  likes: string[];
  comments: any[];
  isFeatured: boolean; // Add isFeatured property
}

interface Comment {
  _id: string;
  content: string;
  author: {
    userId: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: string[];
}

export default function PostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    if (post) {
      fetchComments();
    }
  }, [post]);

  useEffect(() => {
    if (post && user) {
      setLiked(post.likes.includes(user.id));
      setLikesCount(post.likes.length);
    }
  }, [post, user]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/post/${id}`
      );
      if (response.ok) {
        const commentsData = await response.json();
        setComments(commentsData);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleCreateComment = async () => {
    if (!user) {
      alert("Please sign in to comment");
      return;
    }

    if (!newComment.trim()) {
      alert("Please enter a comment");
      return;
    }

    setCommentLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/post/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newComment.trim(),
            userId: user.id,
          }),
        }
      );

      if (response.ok) {
        const comment = await response.json();
        setComments((prev) => [...prev, comment]);
        setNewComment("");
        // Update comment count in post
        setPost((prev) =>
          prev ? { ...prev, comments: [...prev.comments, comment] } : null
        );
      } else {
        const error = await response.json();
        alert(`Failed to post comment: ${error.message}`);
      }
    } catch (error) {
      console.error("Comment error:", error);
      alert("Failed to post comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/posts/${id}`);
      if (response.ok) {
        const postData = await response.json();
        setPost(postData);
      } else {
        setError("Post not found");
      }
    } catch (err) {
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please sign in to like posts");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLikesCount(data.likes);
        setLiked(!liked);
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/posts">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Back Button */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/posts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
        </div>
      </div>

      {/* Post Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="space-y-8">
          {/* Post Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author?.avatar} />
                <AvatarFallback>{post.author?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  <Link
                    href={`/profile/${post.author?.userId}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.author?.name || "Anonymous"}
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString()} •{" "}
                  {post.readingTime} min read
                </p>
              </div>
            </div>

            <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground">{post.excerpt}</p>
            )}

            <div className="flex items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              {post.category && (
                <Badge variant="outline">{post.category}</Badge>
              )}
            </div>
          </header>

          {/* Post Content */}
          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Post Actions */}
          <div className="border-t pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  className="flex items-center gap-2"
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                  <span>{likesCount}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments.length}</span>
                </Button>
              </div>

              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Author Bio */}
          {post.author?.bio && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>
                      {post.author.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      <Link
                        href={`/profile/${post.author?.userId}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.author.name}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground">{post.author.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments Section */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              {user ? (
                <div className="space-y-3 mb-6">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <Button
                    onClick={handleCreateComment}
                    disabled={commentLoading || !newComment.trim()}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {commentLoading ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4 mb-6">
                  <p className="text-muted-foreground mb-2">
                    Please sign in to comment
                  </p>
                  <Link href="/auth/login">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author?.avatar} />
                          <AvatarFallback>
                            {comment.author?.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              <Link
                                href={`/profile/${comment.author?.userId}`}
                                className="hover:text-primary transition-colors"
                              >
                                {comment.author?.name || "Anonymous"}
                              </Link>
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              <span className="text-xs">
                                {comment.likes.length}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </article>
      </main>
    </div>
  );
}
