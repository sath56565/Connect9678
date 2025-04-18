"use client";

import { ChannelType } from "@prisma/client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface CreateSubchannelProps {
  parentId: string;
  serverId: string;
}

export const CreateSubchannel = ({ parentId, serverId }: CreateSubchannelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/channels/sub-channels", {
        name: "new-channel",
        type: ChannelType.TEXT,
        parentId,
        serverId,
      });

      toast({
        title: "Success",
        description: "Subchannel created successfully",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create subchannel",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Plus className="h-4 w-4 text-zinc-500" />
      <p className="text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300">
        {isLoading ? "Creating..." : "Create Subchannel"}
      </p>
    </button>
  );
}; 