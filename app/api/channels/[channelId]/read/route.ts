import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Prisma, RoleType } from "@prisma/client";
import { canViewChannel } from "@/lib/channel-permissions";

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the channel and user's role
    const channel = await db.channel.findUnique({
      where: {
        id: params.channelId,
      },
      include: {
        server: {
          include: {
            members: {
              where: {
                profileId: profile.id
              }
            }
          }
        }
      }
    });

    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    const member = channel.server.members[0];
    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // Check if user has permission to view the channel
    if (!canViewChannel(member.role as RoleType, channel.viewPermission)) {
      return new NextResponse("Not authorized to view channel", { status: 403 });
    }

    // Update unread count
    const updatedChannel = await db.channel.update({
      where: {
        id: params.channelId,
      },
      data: {
        unreadCount: 0,
        lastMessage: new Date()
      } as Prisma.ChannelUpdateInput
    });

    return NextResponse.json(updatedChannel);
  } catch (error) {
    console.log("[CHANNEL_READ_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 