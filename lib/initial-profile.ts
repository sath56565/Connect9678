import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async (path: string = "/") => {
  const user = await currentUser();

  if (!user) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const returnBackUrl = `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    return redirectToSignIn({ returnBackUrl });
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id
    }
  });

  if (profile) return profile;

  const name = user.firstName
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : user.id;

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress
    }
  });

  return newProfile;
};