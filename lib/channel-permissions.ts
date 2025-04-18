import { RoleType } from "@prisma/client";

export const canManageChannel = (role: RoleType) => {
  return role === "ADMIN" || role === "MODERATOR";
};

export const canViewChannel = (userRole: RoleType, channelPermission: RoleType) => {
  const roleHierarchy = {
    ADMIN: 4,
    MODERATOR: 3,
    MEMBER: 2,
    GUEST: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[channelPermission];
};

export const canSendMessage = (userRole: RoleType, channelPermission: RoleType) => {
  const roleHierarchy = {
    ADMIN: 4,
    MODERATOR: 3,
    MEMBER: 2,
    GUEST: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[channelPermission];
}; 