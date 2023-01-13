import { InjectSessionUserDiscordApiClientInterceptor } from './inject-session-user-discord-api-client.interceptor'

describe('InjectSessionUserDiscordApiClientInterceptor', () => {
  it('should be defined', () => {
    expect(new InjectSessionUserDiscordApiClientInterceptor()).toBeDefined()
  })
})
