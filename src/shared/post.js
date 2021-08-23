const mongoProxy = require('./mongoProxy');

module.exports = async function mutatePost(context) {
  const newContext = context.conf.post ? await context.conf.post(context, mongoProxy.requests) : context

  if (!context.conf.skipLogs) {
    await mongoProxy.waitFor
    await mongoProxy.requests.updateOne({
      _id: context.requestId,
    },{
      $set: {
        response: newContext.response,
        end: new Date(),
      }
    })
  }

  return newContext
};
