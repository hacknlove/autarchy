exports.defecto = {
  name:  process.cwd().match(/([^/]*)$/)[1],
  remote: null,
  local: {
    ip: '0.0.0.0',
    port: 1989,
  },
  toQuery: [
    ({
      graphql: {
        query, variable,
      }
    }) => ({
      query, variable,
    })
  ],
  toDocument: (context) => ({
    request: context.request,
    response: context.response
  })
}