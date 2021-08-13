const mongoProxy = require("./mongoProxy");

module.exports = async function mutatePost(context) {
  await mongoProxy.waitFor

  const newContext = context.conf.post ? await context.conf.post(context, mongoProxy.requests) : context

  await mongoProxy.requests.updateOne({
    _id: context.requestId,
  },{
    $set: {
      response: newContext.response,
      end: new Date(),
    }
  })

  return newContext
};
