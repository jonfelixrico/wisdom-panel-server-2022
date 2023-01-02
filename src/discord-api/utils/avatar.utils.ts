import {
  APIGuildMember,
  APIUser,
  CDNRoutes,
  DefaultUserAvatarAssets,
  ImageFormat,
} from 'discord-api-types/v10'

export function getMemberAvatarUrl(
  serverId: string,
  member: APIGuildMember,
): string {
  if (member.avatar) {
    return CDNRoutes.guildMemberAvatar(
      serverId,
      member.user.id,
      member.avatar,
      ImageFormat.WebP,
    )
  }

  return getUserAvatarUrl(member.user)
}

export function getUserAvatarUrl(user: APIUser): string {
  if (user.avatar) {
    // user has an avatar
    return CDNRoutes.userAvatar(user.id, user.avatar, ImageFormat.WebP)
  }

  // user has no avatar
  return CDNRoutes.defaultUserAvatar(
    (Number(user.discriminator) % 5) as DefaultUserAvatarAssets,
  )
}
