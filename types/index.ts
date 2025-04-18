import { Channel, Member, RoleType } from "@prisma/client";

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

export interface NestedChannel extends Omit<Channel, 'description' | 'isPinned' | 'unreadCount' | 'viewPermission' | 'sendPermission' | 'lastMessage' | 'order'> {
  subChannels?: NestedChannel[];
  description: string | null;
  isPinned: boolean;
  unreadCount: number;
  viewPermission: RoleType;
  sendPermission: RoleType;
  lastMessage: Date | null;
  order: number;
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