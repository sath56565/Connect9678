"use client";

import { Channel, Member, RoleType, ChannelType, MemberRole } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import {
  ChevronDown,
  LogOutIcon,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
  Plus
} from "lucide-react";

import { ChannelTree } from "./channel-tree";
import { useModal } from "@/hooks/use-modal-store";
import { ServerData, ExtendedMember } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ServerSidebarProps {
  serverId: string;
}

export const ServerSidebar = ({ serverId }: ServerSidebarProps) => {
  const [server, setServer] = useState<ServerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const { onOpen } = useModal();

  useEffect(() => {
    const fetchServer = async () => {
      if (!userId) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<ServerData>(`/api/servers/${serverId}`);
        
        if (response.data) {
          setServer(response.data);
        } else {
          setError("Server data not found");
        }
      } catch (error) {
        console.error("Error fetching server:", error);
        setError("Failed to load server data");
      } finally {
        setLoading(false);
      }
    };

    fetchServer();
  }, [serverId, userId]);

  if (loading) {
    return (
      <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !server) {
    return (
      <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <div className="flex-1 overflow-y-auto">
          <div className="text-center text-red-500 p-4">
            {error || "Server not found"}
          </div>
        </div>
      </div>
    );
  }

  // Find the user's role in the server
  const currentMember = server.members.find(member => 
    member.profile.userId === userId
  );
  const userRole = currentMember?.role as MemberRole;
  const isAdmin = userRole === MemberRole.ADMIN;
  const isModerator = isAdmin || userRole === MemberRole.MODERATOR;

  // Group channels by type and filter out subchannels
  const textChannels = server.channels.filter(channel => 
    channel.type === "TEXT" && !channel.parentId
  );
  const voiceChannels = server.channels.filter(channel => 
    channel.type === "AUDIO" && !channel.parentId
  );
  const videoChannels = server.channels.filter(channel => 
    channel.type === "VIDEO" && !channel.parentId
  );

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
            {server.name}
            <ChevronDown className="h-5 w-5 ml-auto" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen("invite", { server })}
              className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
            >
              Invite People
              <UserPlus className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen("editServer", { server })}
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Server Settings
              <Settings className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen("members", { server })}
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Manage Members
              <Users className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen("createChannel", { channelType: ChannelType.TEXT, server })}
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Create Channel
              <PlusCircle className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isModerator && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen("deleteServer", { server })}
              className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            >
              Delete Server
              <Trash className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen("leaveServer", { server })}
              className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            >
              Leave Server
              <LogOutIcon className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex-1 overflow-y-auto space-y-4 p-3">
        {textChannels.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase px-2">
              Text Channels
            </h3>
            {textChannels.map((channel) => (
              <ChannelTree 
                key={channel.id}
                channel={channel} 
                serverId={server.id}
                members={server.members}
                userRole={userRole}
              />
            ))}
          </div>
        )}
        
        {voiceChannels.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase px-2">
              Voice Channels
            </h3>
            {voiceChannels.map((channel) => (
              <ChannelTree 
                key={channel.id}
                channel={channel} 
                serverId={server.id}
                members={server.members}
                userRole={userRole}
              />
            ))}
          </div>
        )}

        {videoChannels.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase px-2">
              Video Channels
            </h3>
            {videoChannels.map((channel) => (
              <ChannelTree 
                key={channel.id}
                channel={channel} 
                serverId={server.id}
                members={server.members}
                userRole={userRole}
              />
            ))}
          </div>
        )}

        {server.channels.length === 0 && (
          <div className="text-center text-zinc-500 p-4">
            No channels found
          </div>
        )}
      </div>
    </div>
  );
};
