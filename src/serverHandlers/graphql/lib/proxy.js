const { request } = require('graphql-request');
const { conf } = require('./conf');

module.exports = async function proxy(context) {
  if (!context.conf.remote) {
    return;
  }

  return {
    ...context,
    response: await request(
      conf.remote,
      context.graphql.query,
      context.graphql.variables,
      context.request.headers,
    ).catch((error) => error)
  }
};
