import { prisma } from "@/lib/prisma";
import { Chat } from "@/components/chat/Chat";
import { notFound } from "next/navigation";

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

async function getChannel(channelId: string) {
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
          createdAt: "asc",
        },
        take: 50, // Limit to last 50 messages
      },
    },
  });

  if (!channel) {
    notFound();
  }

  return channel;
}

export default async function ChannelPage({ params }: PageProps) {
  const channel = await getChannel(params.channelId);

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
