import { useEffect, useCallback, useRef, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

// Create a singleton socket instance per channel
const socketInstances: Record<string, Socket> = {};

export const useSocket = (channelId: string) => {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const channelIdRef = useRef<string>(channelId);
  const hasInitialized = useRef<boolean>(false);

  // Update ref when channelId changes to avoid stale closures
  useEffect(() => {
    channelIdRef.current = channelId;
  }, [channelId]);

  // Initialize socket only once per session and channel
  useEffect(() => {
    if (!session?.user || hasInitialized.current) return;

    // Check if we already have a socket for this channel
    if (!socketInstances[channelId]) {
      const socketUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
      const socket = io(socketUrl, {
        query: {
          channelId,
          userId: session.user.id,
        },
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socketInstances[channelId] = socket;

      socket.on("connect", () => {
        console.log(`Connected to channel: ${channelId}`);
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
    }

    socketRef.current = socketInstances[channelId];
    hasInitialized.current = true;

    return () => {
      hasInitialized.current = false;
      // We don't disconnect the socket here to keep it alive for reconnection
      // It will be managed by the singleton pattern
    };
  }, [channelId, session?.user]);

  // Clean up all sockets when component unmounts
  useEffect(() => {
    return () => {
      if (
        socketRef.current &&
        !document.querySelector(`[data-channel="${channelId}"]`)
      ) {
        socketRef.current.disconnect();
        delete socketInstances[channelId];
      }
    };
  }, [channelId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!session?.user || !content.trim()) return;

      try {
        const response = await fetch(
          `/api/channels/${channelIdRef.current}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: content.trim() }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to send message");
        }

        const { message } = await response.json();
        if (socketRef.current) {
          socketRef.current.emit("message", message);
        }

        return message;
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    },
    [session?.user]
  );

  const subscribeToMessages = useCallback(
    (callback: (message: Message) => void) => {
      if (!socketRef.current) return () => {};

      socketRef.current.on("message", callback);

      return () => {
        if (socketRef.current) {
          socketRef.current.off("message", callback);
        }
      };
    },
    []
  );

  return useMemo(
    () => ({
      sendMessage,
      subscribeToMessages,
    }),
    [sendMessage, subscribeToMessages]
  );
};
