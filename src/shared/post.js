module.exports = async function mutatePost(context) {
  return context.conf.post ? context.conf.post(context) : context
};
