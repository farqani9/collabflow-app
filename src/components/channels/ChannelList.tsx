"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Channel {
  id: string;
  name: string;
  description: string | null;
  isPrivate: boolean;
}

export const ChannelList = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const currentChannelId = params.channelId as string;

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch("/api/channels");
        const data = await response.json();
        setChannels(data.channels);
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {channels.map((channel) => (
        <Link
          key={channel.id}
          href={`/channels/${channel.id}`}
          className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
            currentChannelId === channel.id
              ? "bg-gray-200 dark:bg-gray-700"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <span className="mr-2">#</span>
          <span className="truncate">{channel.name}</span>
          {channel.isPrivate && (
            <span className="ml-auto">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>
          )}
        </Link>
      ))}
    </div>
  );
};
