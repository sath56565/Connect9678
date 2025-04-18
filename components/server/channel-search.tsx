"use client";

import { Channel, RoleType } from "@prisma/client";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { canViewChannel } from "@/lib/channel-permissions";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ChannelSearchProps {
  channels: (Channel & { description?: string; viewPermission: RoleType })[];
  serverId: string;
  userRole: RoleType;
}

export const ChannelSearch = ({ channels, serverId, userRole }: ChannelSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const filteredChannels = channels.filter((channel) => {
    const canView = canViewChannel(userRole, channel.viewPermission);
    return canView && channel.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const onChannelClick = async (channelId: string) => {
    try {
      setIsLoading(true);
      await router.push(`/servers/${serverId}/channels/${channelId}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to navigate to channel",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-2 py-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search channels"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border-none bg-zinc-700/50 px-8 py-1 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-0"
          disabled={isLoading}
        />
      </div>
      {searchQuery && (
        <div className="mt-2 space-y-1">
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => onChannelClick(channel.id)}
              className={cn(
                "flex cursor-pointer items-center gap-x-2 rounded-md px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="font-medium">{channel.name}</span>
              {channel.description && (
                <span className="text-xs text-zinc-500">
                  {channel.description}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 