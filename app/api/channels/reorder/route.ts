import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Prisma, RoleType } from "@prisma/client";
import { canManageChannel } from "@/lib/channel-permissions";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { items, parentId, serverId } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }

    if (!items?.length) {
      return new NextResponse("Items are required", { status: 400 });
    }

    // Get the user's role in the server
    const member = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId
      }
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    if (!canManageChannel(member.role as RoleType)) {
      return new NextResponse("Not authorized to manage channels", { status: 403 });
    }

    const transaction = items.map((item: { id: string, order: number }) =>
      db.channel.update({
        where: {
          id: item.id
        },
        data: {
          order: item.order,
          server: { connect: { id: serverId } },
          parent: parentId ? { connect: { id: parentId } } : { disconnect: true }
        } as Prisma.ChannelUpdateInput
      })
    );

    const channels = await db.$transaction(transaction);

    return NextResponse.json(channels);
  } catch (error) {
    console.log("[CHANNELS_REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 