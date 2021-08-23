const send = require('./send')
const {
  renderGraphiQL,
} = require('graphql-helix')

jest.mock('graphql-helix')

describe('serverHandlers/graphql/lib/send', () => {
  it('send 404 if not response', async () => {
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
      send: jest.fn(() => res)
    }

    send(res, { })

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalled()
    expect(res.send).not.toHaveBeenCalled()
    expect(renderGraphiQL).not.toHaveBeenCalled()
  })

  it('renders GraphiQL if shouldRenderGraphiQL', async () => {
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
      send: jest.fn(() => res)
    }

    send(res, { response: { shouldRenderGraphiQL: true } })

    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(res.send).toHaveBeenCalled()
    expect(renderGraphiQL).toHaveBeenCalled()
  })

  it('sens response', async () => {
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
      send: jest.fn(() => res)
    }

    send(res, { response: 'Response' })

    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalled()
    expect(res.send).not.toHaveBeenCalled()
    expect(renderGraphiQL).not.toHaveBeenCalled()
  })
})