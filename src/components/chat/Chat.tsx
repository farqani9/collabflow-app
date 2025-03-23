"use client";

import { useEffect, useRef, useState } from "react";
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

export const Chat = ({ channelId, initialMessages = [] }: ChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const { data: session } = useSession();
  const { sendMessage, subscribeToMessages } = useSocket(channelId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((message) => {
      setMessages((prev) => [...prev, message]);
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
        {messages.map((message) => (
          <Message key={message.id} {...message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
};
