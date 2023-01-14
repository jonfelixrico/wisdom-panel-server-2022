import { PromiseCache } from 'src/utils/promise-cache.utils'

describe('PromiseCache', () => {
  const toSpy = {
    asyncFn: () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 2_500)
      })
    },
  }

  test('a key will only have one running instance at any given time', async () => {
    const cache = new PromiseCache()
    const spiedFn = jest.spyOn(toSpy, 'asyncFn')

    /*
     * This is to simulate multiple calls at a very short time,
     * too short for even a single instance to have completed during those calls.
     */
    cache.run('foo', () => toSpy.asyncFn())
    cache.run('foo', () => toSpy.asyncFn())
    cache.run('foo', () => toSpy.asyncFn())
    cache.run('foo', () => toSpy.asyncFn())
    await cache.run('foo', () => toSpy.asyncFn())

    expect(spiedFn).toBeCalledTimes(1)
  })
})
