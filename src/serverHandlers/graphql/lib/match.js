const { conf } = require('./conf');
const merge = require('deepmerge');
const {
  getGraphQLParameters,
  shouldRenderGraphiQL,
} = require('graphql-helix');

module.exports = function match(req) {
  delete req.headers['if-none-match'];

  if (shouldRenderGraphiQL(req)) {
    return {
      conf: {
        ...conf,
        toDocument: null,
      },
      request: {
        headers: {
          ...req.headers,
          host: new URL(conf.remote).host
        },
        method: req.method,
        body: req.body,
        query: req.query,
      },
      response: {shouldRenderGraphiQL: true } }
  }

  const context = {
    request: {
      headers: {
        ...req.headers,
        host: new URL(conf.remote).host
      },
      method: req.method,
      body: req.body,
      query: req.query,
      graphql: getGraphQLParameters(req),
    },
    conf
  }

  for (const query of conf.queries) {
    const matched = query.match(context);
    if (!matched) {
      continue
    }
    
    context.request.params = matched.params;
    const mergedConf = merge(conf, query.conf)

    context.conf = mergedConf
    context.headers.host = new URL(mergedConf.remote)

    context.response = mergedConf.response
    break;
  }

  return context
};
