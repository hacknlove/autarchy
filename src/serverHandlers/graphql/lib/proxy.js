const { GraphQLClient } = require('graphql-request');
const { conf } = require('./conf');

module.exports = async function proxy(context) {
  if (context.response || !context.conf.remote) {
    return context;
  }

  const graphQLClient = new GraphQLClient(conf.remote, {
    headers: context.request.headers,
  })

  const response = await graphQLClient.request(
    context.request.graphql.query,
    context.request.graphql.variables,
  ).catch((error) => error)

  return {
    ...context,
    response
  }
};
