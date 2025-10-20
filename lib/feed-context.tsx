"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useSocket } from "../hooks/use-socket";

export interface Post {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorName: string;
  authorAvatar?: string;
  coverImage?: string;
  tags: string[];
  category: string;
  status: "draft" | "published" | "archived";
  likes: string[];
  comments: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface FeedUpdate {
  type: "new_post" | "post_updated" | "post_deleted";
  data: Record<string, unknown>;
  timestamp: string;
}

interface FeedContextType {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  fetchFeed: (
    type: "home" | "discover" | "trending" | "latest" | "popular",
    userId?: string
  ) => Promise<void>;
  addPost: (post: Post) => void;
  removePost: (postId: string) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  currentFeedType: "home" | "discover" | "trending" | "latest" | "popular";
  isRealTimeEnabled: boolean;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFeedType, setCurrentFeedType] = useState<
    "home" | "discover" | "trending" | "latest" | "popular"
  >("home");
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);

  const { isConnected, subscribeFeed, onFeedUpdate, onNotification } =
    useSocket();

  // Fetch feed from API
  const fetchFeed = useCallback(
    async (
      type: "home" | "discover" | "trending" | "latest" | "popular",
      userId?: string
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        let endpoint = `/api/feed/${type}`;
        if (type === "home" && userId) {
          endpoint = `/api/feed/home/${userId}`;
        }

        const response = await fetch(`${apiUrl}${endpoint}?page=1&limit=10`);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${type} feed`);
        }

        const data = await response.json();
        setPosts(data.feeds || data.posts || []);
        setCurrentFeedType(type);

        // Enable real-time updates
        if (
          isConnected &&
          (type === "home" ||
            type === "trending" ||
            type === "latest" ||
            type === "popular")
        ) {
          subscribeFeed(type);
          setIsRealTimeEnabled(true);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch feed";
        setError(message);
        console.error("Feed fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, subscribeFeed]
  );

  // Listen to real-time feed updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = onFeedUpdate((update: FeedUpdate) => {
      if (update.type === "new_post") {
        // Add new post to the beginning
        setPosts((prev) => [update.data.data as Post, ...prev]);
      } else if (update.type === "post_updated") {
        // Update existing post
        setPosts((prev) =>
          prev.map((post) =>
            post._id === (update.data.postId as string)
              ? { ...post, ...(update.data as Partial<Post>) }
              : post
          )
        );
      } else if (update.type === "post_deleted") {
        // Remove deleted post
        setPosts((prev) =>
          prev.filter((post) => post._id !== (update.data.postId as string))
        );
      }
    });

    return unsubscribe;
  }, [isConnected, onFeedUpdate]);

  // Listen to notifications (optional)
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = onNotification((notification) => {
      console.log("Notification:", notification);
      // Handle notifications (e.g., show toast)
    });

    return unsubscribe;
  }, [isConnected, onNotification]);

  // Manually add post to feed
  const addPost = useCallback((post: Post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  // Remove post from feed
  const removePost = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  }, []);

  // Update post in feed
  const updatePost = useCallback((postId: string, updates: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((post) => (post._id === postId ? { ...post, ...updates } : post))
    );
  }, []);

  return (
    <FeedContext.Provider
      value={{
        posts,
        isLoading,
        error,
        fetchFeed,
        addPost,
        removePost,
        updatePost,
        currentFeedType,
        isRealTimeEnabled,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeed must be used within FeedProvider");
  }
  return context;
};
