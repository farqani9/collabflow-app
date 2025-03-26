import { prisma } from "@/lib/prisma";
import { Chat } from "@/components/chat/Chat";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface PageProps {
  params: {
    channelId: string;
  };
}

interface MessageWithUser {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  channelId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

async function getChannel(channelId: string, userId: string) {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    include: {
      messages: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 15, // Reduced from 20 to 15 for faster initial load
      },
      members: {
        where: { userId },
      },
    },
  });

  if (!channel) {
    notFound();
  }

  // Check if user has access to private channel
  if (channel.isPrivate && channel.members.length === 0) {
    redirect("/channels");
  }

  channel.messages = channel.messages.reverse();
  return channel;
}

export default async function ChannelPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const channel = await getChannel(params.channelId, session.user.id);

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
      <Chat
        channelId={channel.id}
        initialMessages={channel.messages.map((message: MessageWithUser) => ({
          ...message,
          createdAt: message.createdAt.toISOString(),
          updatedAt: message.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
