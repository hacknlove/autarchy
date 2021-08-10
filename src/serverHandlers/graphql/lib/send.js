const {
  shouldRenderGraphiQL,
} = require('graphql-helix');

module.exports = async function proxy(res, context) {
  if (!context.response) {
    res.statuss(404).json({ error: 'not found' });
    return;
  }

  if (context.response.shouldRenderGraphiQL) {
    res.send(shouldRenderGraphiQL());
  }

  res.json(context.response);
};
