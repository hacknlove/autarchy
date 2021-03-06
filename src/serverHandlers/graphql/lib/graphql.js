const send = require('./send');

const steps = [
  require('./match'),
  require('../../../shared/pre'),
  require('../../../shared/cached'),
  require('./proxy'),
  require('../../../shared/recorder'),
  require('../../../shared/post'),
];


module.exports = async function graphqlHandler(req, res) {
  let context = req

  for (const step of steps) {
    context = await step(context)
  }

  send(res, context)
};
