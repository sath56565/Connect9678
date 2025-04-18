"use client";

import { Channel } from "@prisma/client";
import { useRouter } from "next/navigation";
import { UnreadIndicator } from "./unread-indicator";

interface ChannelItemProps {
  channel: Channel & { unreadCount: number };
  serverId: string;
}

export const ChannelItem = ({ channel, serverId }: ChannelItemProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${serverId}/channels/${channel.id}`);
  };

  return (
    <button
      onClick={onClick}
      className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition"
    >
      <span className="font-semibold text-sm text-zinc-400 group-hover:text-zinc-300">
        {channel.name}
      </span>
      <UnreadIndicator unreadCount={channel.unreadCount} className="ml-auto" />
    </button>
  );
}; 