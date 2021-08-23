const proxy = require('./proxy');
const { GraphQLClient } = require('graphql-request');

jest.mock('graphql-request')

describe('serverHandlers/graphql/lib/proxy', () => {
  it('skips if context.response', async () => {
    expect(await proxy({ response: 'response', conf: { remote: 'foo' } })).toEqual({ response: 'response', conf: { remote: 'foo' } })

    const graphQLClient = { request: jest.fn() }
    GraphQLClient.mockReturnValue(graphQLClient)

    expect(graphQLClient.request).not.toHaveBeenCalled()
  })

  it('skips if context.conf.remote', async () => {
    expect(await proxy({ conf: { } })).toEqual({ conf: { } })

    const graphQLClient = { request: jest.fn() }
    GraphQLClient.mockReturnValue(graphQLClient)

    expect(graphQLClient.request).not.toHaveBeenCalled()
  })

  it('it calls remote and attach the response to the contest', async () => {
    const graphQLClient = { request: jest.fn(() => Promise.resolve('response')) }
    GraphQLClient.mockReturnValue(graphQLClient)

    const context = await proxy({
      request: {
        headers: {},
        graphql: { 
          query: {},
          variables: {}
        }
      },
      conf: { remote: 'foo' }
    })

    expect(context).toEqual({
      response: 'response',
      request: {
        headers: {},
        graphql: { 
          query: {},
          variables: {}
        }
      },
      conf: { remote: 'foo' }
    })
  })
})