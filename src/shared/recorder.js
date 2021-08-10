const mongoProxy = require('./mongoProxy');

module.exports = async function recorder(context) {
  if (context.conf.toDocument) {
    await mongoProxy.waitFor;
  
    await mongoProxy[`rest-${context.conf.name}`].insert(context.conf.toDocument(context));
  }

  return context
};
