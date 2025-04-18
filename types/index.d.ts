import { Channel, Member } from "@prisma/client";

export interface ExtendedMember extends Member {
  profile: {
    id: string;
    userId: string;
    name: string;
    imageUrl: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface NestedChannel extends Channel {
  subChannels?: NestedChannel[];
}

export interface ServerData {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
  channels: NestedChannel[];
  members: ExtendedMember[];
} 