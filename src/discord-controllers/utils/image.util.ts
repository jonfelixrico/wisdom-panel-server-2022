import {
  APIGuild,
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

export function getDefaultUserAvatarUrl(discriminator: string) {
  return CDNRoutes.defaultUserAvatar(
    (Number(discriminator) % 5) as DefaultUserAvatarAssets,
  )
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
    getDefaultUserAvatarUrl(user.discriminator),
    RouteBases.cdn,
  ).toString()
}

export function getServerIconUrl(guild: Pick<APIGuild, 'icon' | 'id'>): string {
  let route: string

  if (guild.icon) {
    route = CDNRoutes.guildIcon(guild.id, guild.icon, getFormat(guild.icon))
  } else {
    // guild has no icon

    const pseudoDiscriminator = /(\d{4})$/.exec(guild.id)[1]
    /*
     * There's no server counterpart for the default avatar,
     * so we'll be retrofitting the one for the user instead
     */
    route = getDefaultUserAvatarUrl(pseudoDiscriminator)
  }

  return new URL(route, RouteBases.cdn).toString()
}
