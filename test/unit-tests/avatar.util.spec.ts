import { getMemberAvatarUrl } from 'src/discord-api/utils/avatar.util'

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
  })

  describe('getUserAvatarUrl', () => {
    test.todo('todo')
  })
})
