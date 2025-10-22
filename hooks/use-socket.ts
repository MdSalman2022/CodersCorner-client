import { useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { useAuth } from "../lib/auth-context";

interface FeedUpdate {
  type: "new_post" | "post_updated" | "post_deleted";
  data: Record<string, unknown>;
  timestamp: string;
}

interface Notification {
  type: "like" | "comment" | "follow";
  data: Record<string, unknown>;
  timestamp: string;
}

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

  const connect = useCallback(() => {
    if (!user?.id) return;
    if (socketRef.current?.connected) return;

    try {
      socketRef.current = io(SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ["websocket", "polling"],
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Socket connected:", socketRef.current?.id);

        socketRef.current?.emit("join_user_room", { userId: user.id });
      });
      socketRef.current.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });

      socketRef.current.on("error", (error: unknown) => {
        console.error("❌ Socket error:", error);
      });

      socketRef.current.on("connect_error", (error: unknown) => {
        console.error("❌ Connection error:", error);
      });
    } catch (error) {
      console.error("Failed to create socket connection:", error);
    }
  }, [user?.id]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const subscribeFeed = useCallback(
    (feedType: "home" | "trending" | "latest" | "popular" = "home") => {
      if (!socketRef.current?.connected) {
        console.warn("Socket not connected, skipping subscribe");
        return;
      }

      socketRef.current.emit("subscribe_feed", { feedType });
      console.log(`📡 Subscribed to ${feedType} feed`);
    },
    []
  );

  const unsubscribeFeed = useCallback(
    (feedType: "home" | "trending" | "latest" | "popular" = "home") => {
      if (!socketRef.current?.connected) return;

      socketRef.current.emit("unsubscribe_feed", { feedType });
      console.log(`📴 Unsubscribed from ${feedType} feed`);
    },
    []
  );

  const onFeedUpdate = useCallback((callback: (update: FeedUpdate) => void) => {
    if (!socketRef.current) return;

    socketRef.current.on("feed_update", (data: unknown) => {
      console.log("📬 Feed update received:", data);
      callback(data as FeedUpdate);
    });

    return () => {
      socketRef.current?.off("feed_update");
    };
  }, []);

  const onNotification = useCallback(
    (callback: (notification: Notification) => void) => {
      if (!socketRef.current) return;

      socketRef.current.on("notification", (data: unknown) => {
        console.log("🔔 Notification received:", data);
        callback(data as Notification);
      });

      return () => {
        socketRef.current?.off("notification");
      };
    },
    []
  );

  useEffect(() => {
    connect();

    return () => {};
  }, [connect]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected ?? false,
    connect,
    disconnect,
    subscribeFeed,
    unsubscribeFeed,
    onFeedUpdate,
    onNotification,
  };
};

export type UseSocketReturn = ReturnType<typeof useSocket>;
