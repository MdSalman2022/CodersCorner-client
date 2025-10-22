"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
  Clock,
  Heart,
  MessageCircle,
  ArrowLeft,
  Send,
  Share2,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Bell,
  BellOff,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { BookmarkButton } from "@/components/bookmark-button";
import { toast } from "sonner";

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: {
    userId: string;
    name: string;
    avatar?: string;
    bio?: string;
    location?: string;
    position?: string;
    education?: string;
    work?: string;
    joinedAt?: string;
  };
  tags: string[];
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  likes: string[];
  comments: Comment[];
  isFeatured: boolean;
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

interface AuthorPost {
  _id: string;
  title: string;
  tags: string[];
  publishedAt: string;
}

export default function PostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorPosts, setAuthorPosts] = useState<AuthorPost[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [notifyComments, setNotifyComments] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    if (post) {
      fetchComments();
      fetchAuthorPosts();
      if (user && post.author.userId !== user.id) {
        checkFollowStatus();
      }
    }
  }, [post, user]);

  useEffect(() => {
    if (post && user) {
      // Ensure likes is an array before calling includes
      const likesArray = Array.isArray(post.likes) ? post.likes : [];
      setLiked(likesArray.includes(user?._id || user.id));
      setLikesCount(likesArray.length || 0);
    }
  }, [post, user]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const trackView = !post ? "true" : "false";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts/${id}?trackView=${trackView}`
      );
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

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments/post/${id}`
      );
      if (response.ok) {
        const commentsData = await response.json();
        setComments(commentsData);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  console.log("post data", post);

  const fetchAuthorPosts = async () => {
    if (!post) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?author=${post.author.userId}&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("author Posts", data);
        const otherPosts = data.posts
          .filter((p: Post) => p._id !== post._id)
          .slice(0, 4);
        setAuthorPosts(otherPosts);
      }
    } catch (error) {
      console.error("Failed to fetch author posts:", error);
    }
  };

  const checkFollowStatus = async () => {
    if (!user || !post) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${post.author.userId}`
      );
      if (response.ok) {
        const authorData = await response.json();
        const isFollowingThisUser = authorData.followers?.includes(user._id);
        setIsFollowing(isFollowingThisUser || false);
      }
    } catch (error) {
      console.error("Failed to check follow status:", error);
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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments/post/${id}`,
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

  const handleLike = async () => {
    if (!user) {
      Router.push("/auth/login");
      return;
    }

    try {
      // Optimistically update UI first
      const userIdToCheck = user._id || user.id || user.betterAuthId;
      const currentlyLiked = liked;
      const currentCount = likesCount;

      // Optimistic update
      setLiked(!currentlyLiked);
      setLikesCount(currentlyLiked ? currentCount - 1 : currentCount + 1);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts/${id}/like`,
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

        if (post) {
          const updatedLikes = data.likes || post.likes;
          const isNowLiked = Array.isArray(updatedLikes)
            ? updatedLikes.includes(userIdToCheck)
            : false;

          // Update with server data
          setPost({
            ...post,
            likes: updatedLikes,
          });

          setLikesCount(Array.isArray(updatedLikes) ? updatedLikes.length : 0);
          setLiked(isNowLiked);

          console.log("✅ Like updated:", {
            isLiked: isNowLiked,
            count: Array.isArray(updatedLikes) ? updatedLikes.length : 0,
          });
        }
      } else {
        // Revert on error
        setLiked(currentlyLiked);
        setLikesCount(currentCount);
        const error = await response.json();
        alert(`Failed to like post: ${error.message}`);
      }
    } catch (error) {
      // Revert on error
      setLiked(!liked);
      setLikesCount(likesCount - (liked ? 1 : -1));
      console.error("Like error:", error);
      alert("Failed to like post");
    }
  };
  const handleFollow = async () => {
    if (!user || !post) return;

    try {
      const method = isFollowing ? "DELETE" : "POST";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${post.author.userId}/follow`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      if (response.ok) {
        await checkFollowStatus();
      } else {
        const error = await response.json();
        alert(
          `Failed to ${isFollowing ? "unfollow" : "follow"}: ${error.message}`
        );
      }
    } catch (error) {
      console.error("Follow error:", error);
      alert(`Failed to ${isFollowing ? "unfollow" : "follow"}`);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/posts">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
          {/* Left Sidebar - Hidden on mobile, shown as fixed on desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-4 flex flex-col items-center">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full flex flex-col items-center justify-center transition-all duration-200 border border-transparent hover:border-muted`}
                title="Like"
              >
                <Heart
                  className={`h-5 w-5 lg:h-6 lg:w-6 transition-all ${
                    liked ? "fill-current text-red-600" : ""
                  }`}
                />
                <span className="text-xs mt-1 font-semibold">{likesCount}</span>
              </button>

              {/* Comments Button */}
              <button
                onClick={() =>
                  document
                    .getElementById("comments")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex flex-col items-center justify-center transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-blue-600 border border-transparent hover:border-muted"
                title="Comments"
              >
                <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="text-xs mt-1 font-semibold">
                  {comments.length}
                </span>
              </button>

              {/* Bookmark Button */}
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-muted border border-transparent hover:border-muted">
                <BookmarkButton
                  postId={id as string}
                  size="sm"
                  variant="minimal"
                />
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-green-600 border border-transparent hover:border-muted"
                title="Share"
              >
                <Share2 className="h-5 w-5 lg:h-6 lg:w-6" />
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-1 lg:col-span-7 space-y-6 lg:space-y-8">
            {/* Mobile Action Buttons - Show only on mobile */}

            <h1 className="block md:hidden text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {post.title}
            </h1>
            <div className="flex md:hidden items-center gap-4 text-center space-y-4">
              {/* Compact Avatar */}
              <div className="relative">
                <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback className="text-lg bg-primary/5 text-primary">
                    {post.author.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h3 className="font-semibold text-lg leading-tight truncate">
                {post.author.name}
              </h3>

              {/* Follow Button */}
              {user && user.id !== post.author.userId && (
                <Button
                  onClick={handleFollow}
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  className="w-26"
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}
            </div>
            <div className="lg:hidden flex items-center justify-between gap-2 py-2 border-b">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                    liked ? "bg-red-50 text-red-600" : "hover:bg-muted"
                  }`}
                  title="Like"
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                  <span className="text-sm font-medium">{likesCount}</span>
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById("comments")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-muted transition-all"
                  title="Comments"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{comments.length}</span>
                </button>

                <BookmarkButton
                  postId={id as string}
                  size="sm"
                  variant="minimal"
                />
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-muted transition-all"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
            {/* Cover Image */}
            {post.coverImage && (
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Post Header */}
            <header className="space-y-4 lg:space-y-6">
              <div className="hidden md:flex items-center gap-3 lg:gap-4">
                <Avatar className="h-10 w-10 lg:h-12 lg:w-12">
                  <AvatarImage src={post.author?.avatar} />
                  <AvatarFallback>
                    {post.author?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base lg:text-lg truncate">
                    <Link
                      href={`/profile/${post.author?.userId}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.author?.name || "Anonymous"}
                    </Link>
                  </p>
                  <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs lg:text-sm text-muted-foreground">
                    <span className="truncate">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    {post.updatedAt && post.updatedAt !== post.publishedAt && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline truncate">
                          Edited {new Date(post.updatedAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readingTime} min</span>
                    </div>
                  </div>
                </div>
              </div>

              <h1 className="hidden md:block text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.category && (
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                )}
              </div>
            </header>

            {/* Post Content */}
            <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Author Bio at Bottom - Mobile optimized */}
            <Card>
              <CardContent className="pt-4 lg:pt-6">
                <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
                  <Avatar className="h-12 w-12 lg:h-16 lg:w-16">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>
                      {post.author.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-base lg:text-lg truncate">
                        <Link
                          href={`/profile/${post.author?.userId}`}
                          className="hover:text-primary transition-colors"
                        >
                          {post.author.name}
                        </Link>
                      </h3>
                      {user && user.id !== post.author.userId && (
                        <Button
                          onClick={handleFollow}
                          variant={isFollowing ? "outline" : "default"}
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </Button>
                      )}
                    </div>
                    {post.author.position && (
                      <p className="text-sm text-muted-foreground mb-1">
                        <Briefcase className="h-3 w-3 inline mr-1" />
                        {post.author.position}
                      </p>
                    )}
                    {post.author.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {post.author.bio}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section - Mobile optimized */}
            <Card id="comments">
              <CardHeader className="px-4 lg:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-lg lg:text-xl">
                    Comments ({comments.length})
                  </CardTitle>
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNotifyComments(!notifyComments)}
                      className="flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      {notifyComments ? (
                        <>
                          <BellOff className="h-4 w-4" />
                          <span className="text-sm">Unsubscribe</span>
                        </>
                      ) : (
                        <>
                          <Bell className="h-4 w-4" />
                          <span className="text-sm">Subscribe</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 lg:space-y-6 px-4 lg:px-6">
                {/* Add Comment */}
                {user ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="text-sm lg:text-base"
                    />
                    <Button
                      onClick={handleCreateComment}
                      disabled={commentLoading || !newComment.trim()}
                      className="flex items-center gap-2 w-full sm:w-auto"
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                      {commentLoading ? "Posting..." : "Post Comment"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Please sign in to comment
                    </p>
                    <Link href="/auth/login">
                      <Button variant="outline" size="sm">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="border-b pb-4 last:border-b-0"
                      >
                        <div className="flex items-start gap-2 lg:gap-3">
                          <Avatar className="h-7 w-7 lg:h-8 lg:w-8 flex-shrink-0">
                            <AvatarImage src={comment.author?.avatar} />
                            <AvatarFallback>
                              {comment.author?.name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-medium text-xs lg:text-sm truncate">
                                <Link
                                  href={`/profile/${comment.author?.userId}`}
                                  className="hover:text-primary transition-colors"
                                >
                                  {comment.author?.name || "Anonymous"}
                                </Link>
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs lg:text-sm break-words">
                              {comment.content}
                            </p>
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
          </main>

          {/* Right Sidebar - Hidden on mobile, shown on large screens */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6 lg:space-y-8">
            {/* Author Profile */}
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Compact Avatar */}
                  <div className="relative">
                    <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback className="text-lg bg-primary/5 text-primary">
                        {post.author.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Author Name */}
                  <div className="space-y-1 w-full">
                    <h3 className="font-semibold text-lg leading-tight truncate">
                      {post.author.name}
                    </h3>
                    {post.author.position && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.author.position}
                      </p>
                    )}
                  </div>

                  {/* Follow Button */}
                  {user && user.id !== post.author.userId && (
                    <Button
                      onClick={handleFollow}
                      variant={isFollowing ? "outline" : "default"}
                      size="sm"
                      className="w-full"
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  )}

                  {/* Author Details - Minimal Design */}
                  <div className="w-full space-y-3 pt-2">
                    {post.author.bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                        {post.author.bio}
                      </p>
                    )}

                    <div className="space-y-2">
                      {post.author.location && (
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {post.author.location}
                          </span>
                        </div>
                      )}
                      {post.author.work && (
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <Briefcase className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{post.author.work}</span>
                        </div>
                      )}
                      {post.author.education && (
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <GraduationCap className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {post.author.education}
                          </span>
                        </div>
                      )}
                      {post.author.joinedAt && (
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            Joined{" "}
                            {new Date(
                              post.author.joinedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* More from Author */}
            {authorPosts.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">
                    More from {post.author.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {authorPosts.map((authorPost) => (
                    <div key={authorPost._id} className="group space-y-2">
                      <Link
                        href={`/posts/${authorPost._id}`}
                        className="block hover:text-primary transition-colors"
                      >
                        <h4 className="font-medium line-clamp-2 leading-tight text-sm group-hover:text-primary">
                          {authorPost.title}
                        </h4>
                      </Link>
                      <div className="flex flex-wrap gap-1">
                        {authorPost.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs px-2 py-0.5 text-muted-foreground hover:bg-primary/10"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {authorPost.tags.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{authorPost.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
