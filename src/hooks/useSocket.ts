import { useEffect, useRef, useCallback } from "react";
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

export const useSocket = (channelId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
      path: "/api/socket",
    });

    socketRef.current = socket;

    // Join the channel
    if (channelId) {
      socket.emit("join-channel", channelId);
    }

    return () => {
      if (channelId) {
        socket.emit("leave-channel", channelId);
      }
      socket.disconnect();
    };
  }, [channelId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current || !session?.user?.id) return;

      socketRef.current.emit("send-message", {
        content,
        channelId,
        userId: session.user.id,
      });
    },
    [channelId, session?.user?.id]
  );

  const subscribeToMessages = useCallback(
    (callback: (message: Message) => void) => {
      if (!socketRef.current) return;

      socketRef.current.on("new-message", callback);

      return () => {
        socketRef.current?.off("new-message", callback);
      };
    },
    []
  );

  return {
    sendMessage,
    subscribeToMessages,
  };
};
