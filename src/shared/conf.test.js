const conf = require('./conf')

describe('shared/conf', () => {
  it('gets the name from cwd', () => {
    expect(conf.defecto.name).toBe('autarchy')
  })

  it('toDocument gets the request and the response', () => {
    const context = { someOtherShit: 'someOtherShit', request: 'request', response: 'response' }

    expect(conf.defecto.toDocument(context)).toEqual({ request: 'request', response: 'response' })
  })
})