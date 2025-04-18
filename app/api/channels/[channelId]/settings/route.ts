import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Prisma, RoleType } from "@prisma/client";
import { canManageChannel } from "@/lib/channel-permissions";

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { description, isPinned, viewPermission, sendPermission } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Validate permission values
    if (!["ADMIN", "MODERATOR", "MEMBER", "GUEST"].includes(viewPermission)) {
      return new NextResponse("Invalid view permission", { status: 400 });
    }

    if (!["ADMIN", "MODERATOR", "MEMBER", "GUEST"].includes(sendPermission)) {
      return new NextResponse("Invalid send permission", { status: 400 });
    }

    // Get the user's role in the server
    const member = await db.member.findFirst({
      where: {
        profileId: profile.id,
        server: {
          channels: {
            some: {
              id: params.channelId
            }
          }
        }
      }
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    if (!canManageChannel(member.role as RoleType)) {
      return new NextResponse("Not authorized to manage channel", { status: 403 });
    }

    const channel = await db.channel.update({
      where: {
        id: params.channelId,
      },
      data: {
        description,
        isPinned,
        viewPermission: viewPermission as RoleType,
        sendPermission: sendPermission as RoleType,
      } as Prisma.ChannelUpdateInput
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("[CHANNEL_SETTINGS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 