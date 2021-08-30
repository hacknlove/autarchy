const match = require('./match')
const conf = require('./conf')

jest.mock('./conf', () => ({
  conf: {
    remote: 'https://example.com',
    endpoints: []
  },
}))

describe('serverHandlers/REST/lib/match', () => {
  it('loops over conf.endpoints testing them until one matches', () => {
    conf.conf.endpoints = [
      {
        match: jest.fn(),
        method: 'POST',
        conf: {
          notMerged: true,
          merged: false,
        }
      },
      {
        match: jest.fn(),
        method: 'GET',
        conf: {
          notMerged: true,
          merged: false,
        }
      },
      {
        match: jest.fn().mockReturnValue({ params: { some: 'param' } }),
        method: 'POST',
        conf: {
          notMerged: false,
          merged: true,
          response: 'injected response'
        }
      },
      {
        match: jest.fn(),
        method: 'POST',
        conf: {
          notMerged: true,
          merged: false,
        }
      }
    ]

    const req = {
      headers: {},
      method: 'POST'
    }

    const context = match(req)

    expect(conf.conf.endpoints[0].match).toHaveBeenCalled()
    expect(conf.conf.endpoints[1].match).not.toHaveBeenCalled()
    expect(conf.conf.endpoints[2].match).toHaveBeenCalled()
    expect(conf.conf.endpoints[3].match).not.toHaveBeenCalled()

    expect(context.conf.notMerged).toBe(false)
    expect(context.conf.merged).toBe(true)
    expect(context.request.params.some).toBe('param')
    expect(context.response).toBe('injected response')
  })
})
