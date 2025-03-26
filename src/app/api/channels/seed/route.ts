import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth";

async function seedChannel(session: Session | null) {
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if general channel already exists
  const existingChannel = await prisma.channel.findFirst({
    where: {
      name: "general",
      ownerId: session.user.id,
    },
  });

  if (existingChannel) {
    return NextResponse.json({
      channel: existingChannel,
      message: "Channel already exists",
    });
  }

  // Create a test channel
  const channel = await prisma.channel.create({
    data: {
      name: "general",
      description: "General discussion channel",
      isPrivate: false,
      ownerId: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: "ADMIN",
        },
      },
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Create a welcome message
  const message = await prisma.message.create({
    data: {
      content: "Welcome to the general channel! 👋",
      userId: session.user.id,
      channelId: channel.id,
    },
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
  });

  return NextResponse.json({
    channel,
    message,
    url: `/channels/${channel.id}`,
  });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    return await seedChannel(session);
  } catch (error) {
    console.error("Error seeding channel:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    return await seedChannel(session);
  } catch (error) {
    console.error("Error seeding channel:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
