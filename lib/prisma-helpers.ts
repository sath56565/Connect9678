import { Prisma } from "@prisma/client";

/**
 * Generates a recursive Prisma include object for channel nesting
 * @param depth - How many levels deep to nest the channels
 * @returns Prisma include object for nested channels
 */
export function generateChannelIncludes(depth: number): Prisma.ChannelInclude {
  if (depth <= 0) {
    return {};
  }

  return {
    subChannels: {
      orderBy: {
        createdAt: "asc"
      },
      include: generateChannelIncludes(depth - 1)
    }
  };
}

// Current max nesting level - can be adjusted as needed
export const MAX_CHANNEL_NESTING = 3; 