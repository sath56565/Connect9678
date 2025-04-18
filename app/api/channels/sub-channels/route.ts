import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type, parentId, serverId } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: ["ADMIN", "MODERATOR"]
            }
          }
        }
      }
    });

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    const parentChannel = parentId ? await db.channel.findUnique({
      where: {
        id: parentId,
        serverId: serverId
      }
    }) : null;

    if (parentId && !parentChannel) {
      return new NextResponse("Parent channel not found", { status: 404 });
    }

    const channel = await db.channel.create({
      data: {
        name,
        type: type as ChannelType,
        profileId: profile.id,
        serverId,
        parentId,
        order: 0
      } as Prisma.ChannelUncheckedCreateInput
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
    const parentId = searchParams.get("parentId");
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID is required", { status: 400 });
    }

    const channels = await db.channel.findMany({
      where: {
        serverId,
        parentId
      } as Prisma.ChannelWhereInput,
      include: {
        subChannels: {
          include: {
            subChannels: {
              include: {
                subChannels: true,
                conversations: {
                  include: {
                    memberOne: true,
                    memberTwo: true
                  }
                }
              }
            },
            conversations: {
              include: {
                memberOne: true,
                memberTwo: true
              }
            }
          }
        },
        conversations: {
          include: {
            memberOne: true,
            memberTwo: true
          }
        }
      } as Prisma.ChannelInclude,
      orderBy: {
        order: "asc"
      } as Prisma.ChannelOrderByWithRelationInput
    });

    return NextResponse.json(channels);
  } catch (error) {
    console.log("[CHANNELS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 