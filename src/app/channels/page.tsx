import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ChannelsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Find or create a default channel for the user
  let defaultChannel = await prisma.channel.findFirst({
    where: {
      OR: [
        { isPrivate: false },
        {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // If no channel exists, create a default one
  if (!defaultChannel) {
    defaultChannel = await prisma.channel.create({
      data: {
        name: "general",
        description: "General discussion",
        isPrivate: false,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
          },
        },
      },
    });

    // Create welcome message
    await prisma.message.create({
      data: {
        content: `Welcome to the #general channel!`,
        channelId: defaultChannel.id,
        userId: session.user.id,
      },
    });
  }

  // Redirect to the default channel
  redirect(`/channels/${defaultChannel.id}`);
}
