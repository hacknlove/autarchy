const mongoProxy = require("./mongoProxy");

module.exports = async function pre(context) {
  if (!context.conf.skipLogs) {
    await mongoProxy.waitFor

    context.requestId = (await mongoProxy.requests.insertOne({
      service: context.conf.name,
      type: context.conf.type,
      start: new Date(),
      request: context.request
    })).insertedId
  }

  return context.conf.pre ? context.conf.pre(context, mongoProxy.requests) : context
};
