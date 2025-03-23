"use client";

import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface MessageProps {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

export const Message = ({ content, createdAt, user }: MessageProps) => {
  const { data: session } = useSession();
  const isOwnMessage = session?.user?.email === user.email;

  return (
    <div
      className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className="flex-shrink-0">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || user.email}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-sm">
              {user.name?.[0] || user.email[0]}
            </span>
          </div>
        )}
      </div>
      <div
        className={`flex flex-col ${
          isOwnMessage ? "items-end" : "items-start"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {user.name || user.email}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
        <div
          className={`mt-1 px-4 py-2 rounded-lg ${
            isOwnMessage
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
};
