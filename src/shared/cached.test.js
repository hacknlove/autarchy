const cached = require('./cached');
const mongoProxy = require('./mongoProxy');

jest.mock('./mongoProxy')

describe('shared/cached', () => {

  it('skips if there is a response', async () => {
    const context = { response: true, conf: { toQuery: [jest.fn()] } }
    expect(await cached(context)).toBe(context)

    expect(context.conf.toQuery[0]).not.toHaveBeenCalled()

    expect(mongoProxy['TEST-test'].findOne).not.toHaveBeenCalled()
  })

  it('skips if there is no toQuery array', async () => {
    const context = { conf: { type: 'TEST', name: 'test' } }

    expect(await cached(context)).toBe(context)

    expect(mongoProxy['TEST-test'].findOne).not.toHaveBeenCalled()
  })

  it('queries the colection sequentially until it gets some response', async () => {
    const context = { conf: {  type: 'TEST', name: 'test', toQuery: [jest.fn(), jest.fn(), jest.fn()] } }

    mongoProxy['TEST-test'].findOne.mockReturnValueOnce(null)
    mongoProxy['TEST-test'].findOne.mockReturnValueOnce({ response: { this: 'is', a: 'response' } })

    expect(await cached(context)).toBe(context)

    expect(context.conf.toQuery[0]).toHaveBeenCalled()
    expect(context.conf.toQuery[1]).toHaveBeenCalled()
    expect(context.conf.toQuery[2]).not.toHaveBeenCalled()

    expect(context.response).toEqual({ this: 'is', a: 'response' })
  })

  it('updates the request log to set it as "fromCache', async () => {
    const context = { conf: {  type: 'TEST', name: 'test', toQuery: [jest.fn()] } }

    mongoProxy['TEST-test'].findOne.mockReturnValue({ response: { this: 'is', a: 'response' } })

    expect(await cached(context)).toBe(context)

    expect(mongoProxy.requests.updateOne).toHaveBeenCalled()
  })

  it('sets toDocument to null, so it will not cache it', async () => {
    const context = { conf: {  type: 'TEST', name: 'test', toQuery: [jest.fn()] } }

    mongoProxy['TEST-test'].findOne.mockReturnValue({ response: { this: 'is', a: 'response' } })

    expect(await cached(context)).toBe(context)

    expect(context.conf.toDocument).toBeNull()
  })

  it('skips updating the log if conf.skipLogs', async () => {
    const context = { conf: {  type: 'TEST', name: 'test', toQuery: [jest.fn()], skipLogs: true } }

    mongoProxy['TEST-test'].findOne.mockReturnValue({ response: { this: 'is', a: 'response' } })

    await cached(context)

    expect(mongoProxy.requests.updateOne).not.toHaveBeenCalled()
  })
})