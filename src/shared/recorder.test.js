const recorder = require('./recorder')
const mongoProxy = require('./mongoProxy');
jest.mock('./mongoProxy')

describe('shared/recorder', () => {
  it('skips if not response', async () => {
    const context = { conf: { toDocument: jest.fn(() => 'document') } }
    await recorder(context)

    expect(mongoProxy['TEST-test'].insertOne).not.toHaveBeenCalled()
    expect(context.conf.toDocument).not.toHaveBeenCalled()
  })
  it('skips if not toDocument', async () => {
    await recorder({ conf: {}, response: 'response'  })

    expect(mongoProxy['TEST-test'].insertOne).not.toHaveBeenCalled()
  })
  it('calls toDocument and inserts the response', async () => {
    const context = {  response: 'response', conf: { type: 'TEST', name: 'test', toDocument: jest.fn(() => 'document') } }

    await recorder(context)

    expect(context.conf.toDocument).toHaveBeenCalled()

    expect(mongoProxy['TEST-test'].insertOne).toHaveBeenCalled()
  })
})