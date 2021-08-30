const send = require('./send')

describe('serverHandlers/REST/lib/send', () => {
  it ('set status, headers and body from response', () => {
    const headers = {}
    const res = {
      status: jest.fn(() => res),
      set: jest.fn((key, value) => {
        headers[key] = value
        return res
      }),
      send: jest.fn(() => res) 
    }

    send(res, { response: { status: 123, body: { some: 'body' }, headers: { foo: 'bar', buz: 'qix' } } })

    expect(headers).toEqual({ foo: 'bar', buz: 'qix' })
    expect(res.status).toHaveBeenCalledWith(123)
    expect(res.send).toHaveBeenCalledWith({ some: 'body' })
  })
})