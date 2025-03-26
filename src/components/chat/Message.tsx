"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface MessageProps {
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

export const Message = ({ content, createdAt, user }: MessageProps) => {
  const { data: session } = useSession();
  const isCurrentUser = session?.user?.email === user.email;

  return (
    <div
      className={`flex items-start gap-2 ${
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="flex-shrink-0">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "User"}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-sm">
              {user.name?.charAt(0) || user.email.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div
        className={`flex flex-col ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">
            {user.name || user.email.split("@")[0]}
          </span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
        <div
          className={`rounded-lg px-4 py-2 max-w-md break-words ${
            isCurrentUser
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
};
