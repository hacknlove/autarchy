const pre = require('./pre')
const mongoProxy = require('./mongoProxy');
jest.mock('./mongoProxy')

describe('shared/pre', () => {
  it('inserts the logs', async () => {
    mongoProxy.requests.insertOne.mockReturnValue({ insertedId: 'testInsertedId'})
    const context = await pre({ conf: {} })


    expect(mongoProxy.requests.insertOne).toHaveBeenCalled()

    expect(context.requestId).toBe('testInsertedId')
  })

  it ('skips inserting the logs', async () => {
    const context = await pre({ conf: { skipLogs: true } })

    expect(mongoProxy.requests.insertOne).not.toHaveBeenCalled()

    expect(context.requestId).toBe(undefined)
  })

  it('calls conf.pre and returns it', async () => {
    const context = await pre({ conf: { skipLogs: true, pre: jest.fn(() => 'modifiedContext') } })

    expect(mongoProxy.requests.insertOne).not.toHaveBeenCalled()

    expect(context).toBe('modifiedContext')
  })
})