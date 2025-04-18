"use client";

import { Channel, ChannelType } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Hash, Mic, Video, Trash, Edit, Move } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChannelSettingsProps {
  channel: Channel & {
    subChannels: Channel[];
  };
  onClose: () => void;
}

export const ChannelSettings = ({ channel, onClose }: ChannelSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [name, setName] = useState(channel.name);
  const [type, setType] = useState<ChannelType>(channel.type);
  const [parentId, setParentId] = useState<string | null>(null);
  const router = useRouter();

  // Initialize parentId from channel after component mounts
  useEffect(() => {
    setParentId((channel as any).parentId);
  }, [channel]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/channels/${channel.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type,
          parentId,
        }),
      });

      if (response.ok) {
        router.refresh();
        onClose();
      }
    } catch (error) {
      console.error("Error updating channel:", error);
    }
  };

  const onDelete = async () => {
    try {
      const response = await fetch(`/api/channels/${channel.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
        onClose();
      }
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Channel Settings</h3>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-x-2 px-2 py-1 rounded-md hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
          >
            <Edit className="h-4 w-4" />
            Edit Channel
          </button>
          <button
            onClick={() => setIsMoving(!isMoving)}
            className="flex items-center gap-x-2 px-2 py-1 rounded-md hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
          >
            <Move className="h-4 w-4" />
            Move Channel
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-x-2 px-2 py-1 rounded-md hover:bg-red-500/10 text-red-500"
          >
            <Trash className="h-4 w-4" />
            Delete Channel
          </button>
        </div>

        {isEditing && (
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Channel name"
              className="w-full px-2 py-1 bg-zinc-700/50 border-none rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
            <div className="flex items-center gap-x-2">
              <button
                type="button"
                onClick={() => setType("TEXT")}
                className={cn(
                  "flex items-center gap-x-1 px-2 py-1 rounded-md text-sm",
                  type === "TEXT" ? "bg-zinc-700/50" : "hover:bg-zinc-700/50"
                )}
              >
                <Hash className="h-4 w-4" />
                Text
              </button>
              <button
                type="button"
                onClick={() => setType("AUDIO")}
                className={cn(
                  "flex items-center gap-x-1 px-2 py-1 rounded-md text-sm",
                  type === "AUDIO" ? "bg-zinc-700/50" : "hover:bg-zinc-700/50"
                )}
              >
                <Mic className="h-4 w-4" />
                Voice
              </button>
              <button
                type="button"
                onClick={() => setType("VIDEO")}
                className={cn(
                  "flex items-center gap-x-1 px-2 py-1 rounded-md text-sm",
                  type === "VIDEO" ? "bg-zinc-700/50" : "hover:bg-zinc-700/50"
                )}
              >
                <Video className="h-4 w-4" />
                Video
              </button>
            </div>
            <button
              type="submit"
              className="w-full px-2 py-1 bg-zinc-700/50 rounded-md text-sm text-white hover:bg-zinc-700/70 transition"
            >
              Save Changes
            </button>
          </form>
        )}

        {isMoving && (
          <form onSubmit={onSubmit} className="space-y-4">
            <select
              value={parentId || ""}
              onChange={(e) => setParentId(e.target.value || null)}
              className="w-full px-2 py-1 bg-zinc-700/50 border-none rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              <option value="">No Parent (Root Level)</option>
              {/* Parent channel options will be populated here */}
            </select>
            <button
              type="submit"
              className="w-full px-2 py-1 bg-zinc-700/50 rounded-md text-sm text-white hover:bg-zinc-700/70 transition"
            >
              Move Channel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}; 