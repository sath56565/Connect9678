import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { MemberRole, ChannelType } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: "general",
              profileId: profile.id,
              type: ChannelType.TEXT,
              viewPermission: "MEMBER",
              sendPermission: "MEMBER"
            }
          ]
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN
            }
          ]
        }
      },
      include: {
        channels: true,
        members: true
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
