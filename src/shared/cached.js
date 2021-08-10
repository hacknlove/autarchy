/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
const mongoProxy = require('./mongoProxy');

module.exports = async function pre(context) {
  if (!context.conf.toQuery) {
    return context;
  }

  await mongoProxy.waitFor;

  for (const query of context.conf.toQuery) {
    context.response = await mongoProxy[`${context.conf.type}-${context.conf.name}`].findOne(query(context))
    if (context.response) {
      break
    }
  }

  return context
};
