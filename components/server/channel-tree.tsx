"use client";

import { Channel, ChannelType, RoleType } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Hash, Mic, Video, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";
import { useToast } from "@/components/ui/use-toast";
import { canManageChannel, canViewChannel } from "@/lib/channel-permissions";
import { ExtendedMember, NestedChannel } from "@/types";

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

interface ChannelTreeProps {
  channel: NestedChannel;
  level?: number;
  serverId: string;
  members: ExtendedMember[];
  userRole: RoleType;
}

export const ChannelTree = ({ channel, level = 0, serverId, members, userRole }: ChannelTreeProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();
  const { toast } = useToast();

  const canManage = canManageChannel(userRole);
  const canView = canViewChannel(userRole, channel.viewPermission);

  const onChannelClick = async () => {
    if (!canView) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to view this channel",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
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

  const onCreateSubchannel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canManage) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to create channels",
        variant: "destructive",
      });
      return;
    }
    onOpen("createChannel", { 
      parentId: channel.id,
      channelType: channel.type as ChannelType 
    });
  };

  const onEditChannel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canManage) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit this channel",
        variant: "destructive",
      });
      return;
    }
    onOpen("editChannel", { channel });
  };

  const Icon = () => {
    switch (channel.type) {
      case "TEXT":
        return <Hash className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />;
      case "AUDIO":
        return <Mic className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />;
      case "VIDEO":
        return <Video className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />;
      default:
        return <Hash className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />;
    }
  };

  return (
    <div>
      <div
        onClick={onChannelClick}
        className={cn(
          "group flex items-center justify-between w-full px-2 py-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 rounded-md transition cursor-pointer",
          params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700",
          isLoading && "opacity-50 cursor-not-allowed",
          !canView && "opacity-50 cursor-not-allowed"
        )}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
      >
        <div className="flex items-center gap-x-2 overflow-hidden">
          <Icon />
          <p className="line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition">
            {channel.name}
          </p>
        </div>
        
        {canManage && (
          <div className="flex items-center gap-x-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onCreateSubchannel}
              className="text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={onEditChannel}
              className="text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              disabled={isLoading}
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {channel.subChannels?.map((subChannel) => (
        <ChannelTree
          key={subChannel.id}
          channel={subChannel}
          level={level + 1}
          serverId={serverId}
          members={members}
          userRole={userRole}
        />
      ))}
    </div>
  );
}; 