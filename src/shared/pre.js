module.exports = async function pre(context) {
  return context.conf.pre ? context.conf.pre(context) : context
};
