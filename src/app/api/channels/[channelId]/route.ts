import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface RouteParams {
  params: {
    channelId: string;
  };
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const channel = await prisma.channel.findUnique({
      where: { id: params.channelId },
      select: {
        id: true,
        name: true,
        description: true,
        isPrivate: true,
        ownerId: true,
        members: {
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });

    if (!channel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    // Check if user has access to private channel
    if (
      channel.isPrivate &&
      !channel.members.some((member) => member.userId === session.user.id)
    ) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ channel });
  } catch (error) {
    console.error('Error fetching channel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
 