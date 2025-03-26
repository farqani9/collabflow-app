"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { useSocket } from "@/hooks/useSocket";
import { Message } from "./Message";
import { ChatInput } from "./ChatInput";
import { useSession } from "next-auth/react";

interface ChatMessage {
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

interface ChatProps {
  channelId: string;
  initialMessages?: ChatMessage[];
}

// Memoize Message component to prevent unnecessary re-renders
const MemoizedMessage = memo(Message);

export const Chat = ({ channelId, initialMessages = [] }: ChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const { data: session } = useSession();
  const { sendMessage, subscribeToMessages } = useSocket(channelId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/channels/${channelId}/messages?page=${page}&limit=20`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, ...data.messages]);
        setHasMore(data.hasMore);
        setPage((p) => p + 1);
      }
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [channelId, hasMore, isLoading, page]);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((message) => {
      setMessages((prev) => [message, ...prev]);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribeToMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        Please sign in to view messages
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {hasMore && (
              <button
                onClick={loadMoreMessages}
                disabled={isLoading}
                className="w-full py-2 text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Load more messages"}
              </button>
            )}
            {messages.map((message) => (
              <MemoizedMessage key={message.id} {...message} />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
};
