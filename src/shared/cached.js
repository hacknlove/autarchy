/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
const mongoProxy = require('./mongoProxy');

module.exports = async function cached(context) {
  if (context.response || !context.conf.toQuery) {
    return context;
  }

  await mongoProxy.waitFor;

  for (const query of context.conf.toQuery) {
    context.response = await mongoProxy[`${context.conf.type}-${context.conf.name}`].findOne(query(context))
    if (context.response) {
      break
    }
  }

  if (context.response) {
    context.conf.toDocument = null
    context.response = context.response.response

    if (!context.conf.skipLogs) {
      await mongoProxy.requests.updateOne({
        _id: context.requestId,
      },{
        $set: {
          fromCache: true
        }
      })
    }
  }

  return context
};
