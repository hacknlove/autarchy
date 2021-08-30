const proxy = require('./proxy')
const fetch = require('node-fetch')
jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox())
const fetchMock = require('fetch-mock-jest');

describe('serverHandlers/REST/lib/proxy', () => {
  it('skips if context.conf.remote', async () => {
    const context = { conf: {} }
    expect(await proxy(context)).toBe(context)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('skips if context.response', async () => {
    const context = { conf: { remote: 'example.com' }, response: 'some response' }

    expect(await proxy(context)).toBe(context)
    expect(fetch).not.toHaveBeenCalled()
  })

  it.skip('calls conf.remote host / path ? search and creates request', async () => {
    const context = {
      conf: {
        remote: 'https://example.com'
      },
      request: {
        method: 'POST',
        headers: { host: 'some.host' },
        body: { some: 'json' },
        query: { foo: 'bar' },
        path: '/path'
      }
    }

    fetchMock.mock({
      name: 'route',
      matcher: 'https://example.com/path?foo=bar',
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-cache',
      body: { response: 'response' },
      headers: {
        'content-type': 'application/json',
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
      },
      response: {
        status: 200,
        body: []
      }
    });

    fetchMock.post('https://example.com/path?foo=bar', { response: 'response' }) // { body: , status: 200 } )

    expect(await proxy(context)).toBe(context)
    expect(fetch).toHaveBeenCalledWith()
  })
})
