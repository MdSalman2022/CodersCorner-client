"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface BookmarkContextType {
  bookmarkedPostIds: Set<string>;
  isBookmarked: (postId: string) => boolean;
  addBookmark: (postId: string) => void;
  removeBookmark: (postId: string) => void;
  refreshBookmarks: () => Promise<void>;
  isLoading: boolean;
}

const BookmarkContext = createContext<BookmarkContextType | null>(null);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all bookmarks once when user logs in
  useEffect(() => {
    if (user) {
      fetchAllBookmarks();
    } else {
      setBookmarkedPostIds(new Set());
    }
  }, [user]);

  const fetchAllBookmarks = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookmarks/ids?userId=${user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Convert array of post IDs to Set for O(1) lookup
        setBookmarkedPostIds(new Set(data.postIds || []));
        console.log("✅ Loaded bookmarks:", data.postIds?.length || 0);
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isBookmarked = (postId: string): boolean => {
    return bookmarkedPostIds.has(postId);
  };

  const addBookmark = (postId: string) => {
    setBookmarkedPostIds((prev) => new Set([...prev, postId]));
  };

  const removeBookmark = (postId: string) => {
    setBookmarkedPostIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
  };

  const refreshBookmarks = async () => {
    await fetchAllBookmarks();
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedPostIds,
        isBookmarked,
        addBookmark,
        removeBookmark,
        refreshBookmarks,
        isLoading,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
}
