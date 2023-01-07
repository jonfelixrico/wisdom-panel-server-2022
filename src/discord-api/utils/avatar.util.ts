import {
  APIGuildMember,
  APIUser,
  CDNRoutes,
  DefaultUserAvatarAssets,
  ImageFormat,
  RouteBases,
} from 'discord-api-types/v10'

function getFormat(hash: string) {
  if (hash.startsWith('a_')) {
    return ImageFormat.GIF
  }

  return ImageFormat.PNG
}

export function getMemberAvatarUrl(
  serverId: string,
  member: APIGuildMember,
): string {
  if (member.avatar) {
    return new URL(
      CDNRoutes.guildMemberAvatar(
        serverId,
        member.user.id,
        member.avatar,
        getFormat(member.avatar),
      ),
      RouteBases.cdn,
    ).toString()
  }

  return getUserAvatarUrl(member.user)
}

export function getUserAvatarUrl(user: APIUser): string {
  if (user.avatar) {
    // user has an avatar
    return new URL(
      CDNRoutes.userAvatar(user.id, user.avatar, getFormat(user.avatar)),
      RouteBases.cdn,
    ).toString()
  }

  // user has no avatar
  return new URL(
    CDNRoutes.defaultUserAvatar(
      (Number(user.discriminator) % 5) as DefaultUserAvatarAssets,
    ),
    RouteBases.cdn,
  ).toString()
}
