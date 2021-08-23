const {
  renderGraphiQL,
} = require('graphql-helix');

module.exports = async function proxy(res, context) {
  if (!context.response) {
    res.status(404).json({ error: 'not found' });
    return;
  }

  if (context.response.shouldRenderGraphiQL) {
    return res.send(renderGraphiQL());
  }

  res.json({ data: context.response });
};
