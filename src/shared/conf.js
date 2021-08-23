exports.defecto = {
  name:  process.cwd().match(/([^/]*)$/)[1],
  remote: null,
  local: {
    ip: '0.0.0.0',
    port: 1989,
  },
  toQuery: [],
  toDocument: (context) => ({
    request: context.request,
    response: context.response
  })
}