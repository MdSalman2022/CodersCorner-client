"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFeed } from "@/lib/feed-context";
import { useAuth } from "@/lib/auth-context";
import { Heart, MessageCircle, Bookmark, Share } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedComponentProps {
  feedType?: "home" | "discover" | "trending" | "latest" | "popular";
  className?: string;
}

export const FeedComponent: React.FC<FeedComponentProps> = ({
  feedType = "discover",
  className = "",
}) => {
  const { posts, isLoading, error, fetchFeed, isRealTimeEnabled } = useFeed();
  const { user } = useAuth();

  useEffect(() => {
    if (feedType === "home" && user?.id) {
      fetchFeed(feedType, user.id);
    } else if (feedType !== "home") {
      fetchFeed(feedType);
    }
  }, [feedType, user?.id, fetchFeed]);

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-400",
          className
        )}
      >
        Error loading feed: {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div
        className={cn(
          "text-center py-12 text-gray-500 dark:text-gray-400",
          className
        )}
      >
        <p className="text-lg font-medium">No posts found</p>
        <p className="text-sm">Start following users or check back later</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Real-time indicator */}
      {isRealTimeEnabled && (
        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
          <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse" />
          Real-time updates enabled
        </div>
      )}

      {/* Posts grid */}
      {posts.map((post) => (
        <article
          key={post._id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              {post.authorAvatar && (
                <Image
                  src={post.authorAvatar}
                  alt={post.authorName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {post.authorName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="mb-4 rounded-lg overflow-hidden h-48">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <Link href={`/posts/${post._id}`}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2">
                {post.title}
              </h2>
            </Link>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {post.tags?.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  {tag}
                </Link>
              ))}
              {post.category && (
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                  {post.category}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1">
                <Heart
                  size={16}
                  className={
                    user?.id && post.likes?.includes(user.id)
                      ? "fill-red-500 text-red-500"
                      : ""
                  }
                />
                <span>{post.likes?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{post.comments || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{post.views || 0} views</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm">
                <Heart size={18} />
                Like
              </button>
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm">
                <MessageCircle size={18} />
                Comment
              </button>
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors text-sm">
                <Bookmark size={18} />
                Bookmark
              </button>
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors text-sm">
                <Share size={18} />
                Share
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
