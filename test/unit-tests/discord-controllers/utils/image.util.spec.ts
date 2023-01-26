import {
  getMemberAvatarUrl,
  getUserAvatarUrl,
} from 'src/discord-controllers/utils/image.util'

describe('avatar utils', () => {
  describe('getMemberAvatarUrl', () => {
    it('should yield png url if avatar hash is not animated', () => {
      const url = getMemberAvatarUrl('dummy-server', {
        avatar: 'member-avatar',
        user: {
          avatar: 'user-avatar',
          discriminator: '1234',
          id: 'user-id',
        },
      })

      expect(url).toContain('png')
    })

    it('should yield gif url if avatar hash is animated', () => {
      const url = getMemberAvatarUrl('dummy-server', {
        avatar: 'a_member-avatar',
        user: {
          avatar: 'user-avatar',
          discriminator: '1234',
          id: 'user-id',
        },
      })

      expect(url).toContain('gif')
    })

    it('should still be able to yield a url if there is no member avatar', () => {
      const url = getMemberAvatarUrl('dummy-server', {
        avatar: null,
        user: {
          avatar: 'user-avatar',
          discriminator: '1234',
          id: 'user-id',
        },
      })

      expect(url).toBeTruthy()
    })
  })

  describe('getUserAvatarUrl', () => {
    it('should yield png url if avatar hash is not animated', () => {
      const url = getUserAvatarUrl({
        avatar: 'user-avatar',
        discriminator: '1234',
        id: 'user-id',
      })

      expect(url).toContain('png')
    })

    it('should yield gif url if avatar hash is animated', () => {
      const url = getUserAvatarUrl({
        avatar: 'a_user-avatar',
        discriminator: '1234',
        id: 'user-id',
      })

      expect(url).toContain('gif')
    })

    test('fallback to default avatar if user didnt have any', () => {
      const url = getUserAvatarUrl({
        avatar: null,
        discriminator: '1234',
        id: 'user-id',
      })

      expect(url).toContain('png')
      expect(url).toContain('/embed/avatars')
    })
  })
})
