const mongoProxy = require('./mongoProxy');

module.exports = async function recorder(context) {
  if (context.response && context.conf.toDocument) {
    await mongoProxy.waitFor;
  
    await mongoProxy[`${context.conf.type}-${context.conf.name}`].insertOne(context.conf.toDocument(context));
  }

  return context
};
