import { NextResponse } from "next/server";
import { MemberRole, ChannelType, Prisma } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface UpdateChannelRequest {
  name?: string;
  type?: ChannelType;
  parentId?: string | null;
  order?: number;
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, type, parentId, order }: UpdateChannelRequest = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const channel = await db.channel.findUnique({
      where: {
        id: params.channelId
      },
      include: {
        server: {
          include: {
            members: {
              include: {
                profile: true
              }
            }
          }
        }
      }
    });

    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    const server = channel.server;

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    const member = server.members.find((member) => member.profileId === profile.id);

    if (!member || (member.role !== MemberRole.ADMIN && member.role !== MemberRole.MODERATOR)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // If moving to a new parent, validate the parent exists and is in the same server
    if (parentId) {
      const newParent = await db.channel.findUnique({
        where: {
          id: parentId,
          serverId: server.id
        }
      });

      if (!newParent) {
        return new NextResponse("Parent channel not found", { status: 404 });
      }
    }

    const updateData: Prisma.ChannelUpdateInput = {
      ...(name && { name }),
      ...(type && { type }),
      ...(order !== undefined && { order }),
      ...(parentId !== undefined && {
        parent: parentId ? { connect: { id: parentId } } : { disconnect: true }
      })
    };

    const updatedChannel = await db.channel.update({
      where: {
        id: params.channelId
      },
      data: updateData,
      include: {
        server: true,
        profile: true,
        messages: true
      }
    });

    return NextResponse.json(updatedChannel);
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const channel = await db.channel.findUnique({
      where: {
        id: params.channelId
      },
      include: {
        server: {
          include: {
            members: {
              include: {
                profile: true
              }
            }
          }
        }
      }
    });

    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    const server = channel.server;

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    const member = server.members.find((member) => member.profileId === profile.id);

    if (!member || (member.role !== MemberRole.ADMIN && member.role !== MemberRole.MODERATOR)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const deletedChannel = await db.channel.delete({
      where: {
        id: params.channelId
      }
    });

    return NextResponse.json(deletedChannel);
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 