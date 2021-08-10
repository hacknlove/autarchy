const { conf } = require('./conf');
const merge = require('deepmerge');

module.exports = function match(req) {
  delete req.headers['if-none-match'];

  const context = {
    request: {
      path: req.path,
      params: {},
      headers: {
        ...req.headers,
        host: new URL(conf.remote)
      },
      method: req.method,
      body: req.body,
      query: req.query,
    },
    conf
  }

  for (const endpoint of conf.endpoints) {
    if (!endpoint.match || (endpoint.method !== req.method && endpoint.method !== 'all')) {
      continue
    }
    const matched = endpoint.match(req.path);
    if (!matched) {
      continue
    }
    
    context.request.params = matched.params;
    const mergedConf = merge(conf, endpoint.conf)

    context.conf = mergedConf
    context.headers.host = new URL(mergedConf.remote)

    context.response = mergedConf.response
    break;
  }

  return context
};
