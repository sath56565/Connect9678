"use client";

import { cn } from "@/lib/utils";

interface UnreadIndicatorProps {
  unreadCount: number;
  className?: string;
}

export const UnreadIndicator = ({ unreadCount, className }: UnreadIndicatorProps) => {
  if (!unreadCount) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-indigo-500 text-white text-xs font-semibold",
        unreadCount > 99 ? "w-6 h-6" : "w-5 h-5",
        className
      )}
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </div>
  );
}; 