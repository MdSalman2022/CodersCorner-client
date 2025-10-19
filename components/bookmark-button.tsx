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
}

export function BookmarkButton({ postId, size = "sm" }: BookmarkButtonProps) {
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

    // Optimistic update - update UI immediately
    const wasBookmarked = bookmarked;
    if (wasBookmarked) {
      removeBookmark(postId);
    } else {
      addBookmark(postId);
    }

    try {
      const endpoint = wasBookmarked
        ? `http://localhost:5000/api/bookmarks/${postId}?userId=${user.id}`
        : "http://localhost:5000/api/bookmarks";

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
        // Revert optimistic update on failure
        if (wasBookmarked) {
          addBookmark(postId);
        } else {
          removeBookmark(postId);
        }
        toast.error("Failed to update bookmark");
      }
    } catch (error) {
      // Revert optimistic update on error
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
      variant="ghost"
      size={size}
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={`gap-2 ${bookmarked ? "text-primary" : ""}`}
    >
      <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-primary" : ""}`} />
      {size === "lg" && (
        <span className="hidden sm:inline">
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </span>
      )}
    </Button>
  );
}
