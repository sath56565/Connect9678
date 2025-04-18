"use client";

import { Channel, RoleType } from "@prisma/client";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Member {
  id: string;
  role: RoleType;
  profileId: string;
  serverId: string;
  createdAt: Date;
  updatedAt: Date;
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

interface ServerSearchProps {
  data: {
    channels: Channel[];
    members: Member[];
  };
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredChannels = data.channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = data.members.filter((member) =>
    member.profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onChannelClick = (channelId: string) => {
    router.push(`/channels/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    router.push(`/members/${memberId}`);
  };

  return (
    <div className="px-2 py-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search channels and members"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border-none bg-zinc-700/50 px-8 py-1 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-0"
        />
      </div>
      {searchQuery && (
        <div className="mt-2 space-y-1">
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => onChannelClick(channel.id)}
              className="flex cursor-pointer items-center gap-x-2 rounded-md px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300"
            >
              <span className="font-medium">{channel.name}</span>
            </div>
          ))}
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => onMemberClick(member.id)}
              className="flex cursor-pointer items-center gap-x-2 rounded-md px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300"
            >
              <span className="font-medium">{member.profile.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
