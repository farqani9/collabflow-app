"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChannelList } from "@/components/channels/ChannelList";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Channel {
  id: string;
  name: string;
  description: string | null;
}

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const params = useParams();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChannel = async () => {
      if (params.channelId) {
        try {
          const response = await fetch(`/api/channels/${params.channelId}`);
          if (response.ok) {
            const data = await response.json();
            setChannel(data.channel);
          }
        } catch (error) {
          console.error("Error fetching channel:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchChannel();
  }, [params.channelId]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">Please sign in to access channels</p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4">Loading channel...</p>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Channel Not Found</h1>
          <p className="mb-4">The requested channel could not be found.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Channels
          </h2>
        </div>
        <nav className="p-4">
          <ChannelList />
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              <span className="text-gray-500 dark:text-gray-400">#</span>{" "}
              {channel.name}
            </h1>
            {channel.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {channel.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Channel actions will be added here */}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
