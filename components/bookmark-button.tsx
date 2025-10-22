"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useBookmarks } from "@/lib/bookmark-context";

interface BookmarkButtonProps {
  postId: string;
  size?: "sm" | "lg";
  variant?: "default" | "minimal";
}

export function BookmarkButton({
  postId,
  size = "sm",
  variant = "default",
}: BookmarkButtonProps) {
  const { user } = useAuth();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const [isLoading, setIsLoading] = useState(false);

  const bookmarked = isBookmarked(postId);

  const handleToggleBookmark = async () => {
    if (!user) {
      toast.error("Please sign in to bookmark posts");
      return;
    }

    setIsLoading(true);

    const wasBookmarked = bookmarked;
    if (wasBookmarked) {
      removeBookmark(postId);
    } else {
      addBookmark(postId);
    }

    try {
      const endpoint = wasBookmarked
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookmarks/${postId}?userId=${user.id}`
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookmarks`;

      const method = wasBookmarked ? "DELETE" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body:
          method === "POST"
            ? JSON.stringify({
                postId,
                userId: user.id,
              })
            : undefined,
      });

      if (response.ok) {
        toast.success(
          wasBookmarked ? "Bookmark removed" : "Post bookmarked successfully"
        );
      } else {
        if (wasBookmarked) {
          addBookmark(postId);
        } else {
          removeBookmark(postId);
        }
        toast.error("Failed to update bookmark");
      }
    } catch (error) {
      if (wasBookmarked) {
        addBookmark(postId);
      } else {
        removeBookmark(postId);
      }
      console.error("Bookmark error:", error);
      toast.error("Failed to update bookmark");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant === "minimal" ? "ghost" : "ghost"}
      size={size}
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={`gap-2 ${bookmarked ? "text-yellow-600" : ""} ${
        variant === "minimal"
          ? "p-0 h-auto w-auto bg-transparent hover:bg-transparent border-0"
          : ""
      }`}
    >
      <Bookmark className={`h-6 w-6 ${bookmarked ? "fill-yellow-600" : ""}`} />
      {size === "lg" && variant !== "minimal" && (
        <span className="hidden sm:inline">
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </span>
      )}
    </Button>
  );
}
