const match = require('./match')
const conf = require('./conf')

jest.mock('./conf', () => ({
  conf: {
    remote: 'https://example.com',
    queries: []
  },
}))

const {
  getGraphQLParameters,
  shouldRenderGraphiQL,
} = require('graphql-helix');

jest.mock('graphql-helix')




describe('serverHandlers/graphql/lib/match', () => {
  it('shouldRenderGraphiQL, return a special context', () => {
    shouldRenderGraphiQL.mockReturnValue(true)

    const context = match({ headers: {} })
    expect(context.response.shouldRenderGraphiQL).toBe(true)
    expect(context.conf.toDocument).toBeNull()
    expect(getGraphQLParameters).not.toHaveBeenCalled()
    expect(context.request.headers.host).toBe('example.com')
  })

  it('loops over conf.queries until one matches', () => {
    shouldRenderGraphiQL.mockReturnValue(false)

    conf.conf.queries = [
      {
        match: jest.fn().mockReturnValue(false),
        conf: {}
      },
      {
        match: jest.fn().mockReturnValue(true),
        conf: {
          remote: 'https://foo.com',
          response: 'some response'
        }
      },
      {
        match: jest.fn(),
        conf: {}
      },
    ]

    const context = match({ headers: {} })
    expect(getGraphQLParameters).toHaveBeenCalled()

    expect(conf.conf.queries[0].match).toHaveBeenCalled()
    expect(conf.conf.queries[1].match).toHaveBeenCalled()
    expect(conf.conf.queries[2].match).not.toHaveBeenCalled()
    expect(context.request.headers.host).toBe('foo.com')
  })
})