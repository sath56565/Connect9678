import { NextResponse } from "next/server";
import { MemberRole, ChannelType } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { generateChannelIncludes, MAX_CHANNEL_NESTING } from "@/lib/prisma-helpers";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const parentId = searchParams.get("parentId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!name || !type) {
      return new NextResponse("Name and type are required", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    if (!Object.values(ChannelType).includes(type)) {
      return new NextResponse("Invalid channel type", { status: 400 });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      }
    });

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    // If parentId is provided, verify it exists and belongs to the same server
    if (parentId) {
      const parentChannel = await db.channel.findFirst({
        where: {
          id: parentId,
          serverId
        }
      });

      if (!parentChannel) {
        return new NextResponse("Parent channel not found", { status: 404 });
      }
    }

    const channel = await db.channel.create({
      data: {
        name,
        type,
        profileId: profile.id,
        serverId,
        parentId: parentId || null,
        viewPermission: "MEMBER",
        sendPermission: "MEMBER"
      }
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("[CHANNELS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }

    const channels = await db.channel.findMany({
      where: {
        serverId,
        parentId: null // Only fetch top-level channels
      },
      include: generateChannelIncludes(MAX_CHANNEL_NESTING),
      orderBy: {
        createdAt: "asc"
      }
    });

    return NextResponse.json(channels);
  } catch (error) {
    console.log("[CHANNELS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
