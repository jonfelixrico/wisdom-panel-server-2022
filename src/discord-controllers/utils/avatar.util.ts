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

type User = Pick<APIUser, 'avatar' | 'id' | 'discriminator'>

interface Member extends Pick<APIGuildMember, 'avatar'> {
  user?: User
  avatar?: string
}

export function getMemberAvatarUrl(serverId: string, member: Member): string {
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

export function getUserAvatarUrl(user: User): string {
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
