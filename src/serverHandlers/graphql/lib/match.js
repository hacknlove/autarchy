const { conf } = require('./conf');
const merge = require('deepmerge');
const {
  getGraphQLParameters,
  shouldRenderGraphiQL,
} = require('graphql-helix');

module.exports = function match(req) {
  delete req.headers['if-none-match'];

  if (shouldRenderGraphiQL(req.request)) {
    return { shouldRenderGraphiQL: true }
  }

  const context = {
    request: {
      path: req.path,
      params: {},
      headers: {
        ...req.headers,
        host: new URL(conf.remote)
      },
      graphql: getGraphQLParameters(req.request),
      method: req.method,
      body: req.body,
      query: req.query,
    },
    conf
  }

  for (const query of conf.queries) {
    const matched = query.match(req.path);
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
