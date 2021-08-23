const mutatePost = require('./post')
const mongoProxy = require('./mongoProxy');
jest.mock('./mongoProxy')

describe('shared/post', () => {
  it('does not crash if there is no context.post', async () => {
    const context = { conf: {}, response: 'some response' }
    expect(await mutatePost(context)).toBe(context)
  })

  it('calls conf.post if exists', async () => {
    const context = { conf: { post: jest.fn(() => context) }, response: 'some response' }
    expect(await mutatePost(context)).toBe(context)

    expect(context.conf.post).toHaveBeenCalled()
  })

  it('updates the logs', async () => {
    const context = { conf: {}, response: 'some response' }
    expect(await mutatePost(context)).toBe(context)

    expect(mongoProxy.requests.updateOne).toHaveBeenCalled()
  })

  it('skips updating the logs if skipLogs is true', async () => {
    const context = { conf: { skipLogs: true }, response: 'some response' }
    expect(await mutatePost(context)).toBe(context)

    expect(mongoProxy.requests.updateOne).not.toHaveBeenCalled()
  })
})