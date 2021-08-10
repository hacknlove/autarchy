const send = require('./send');
const steps = [
  require("./match"),
  require('./reqSchema'),
  require('./pre'),
  require('./cached'),
  require('./proxy'),
  require('./recorder'),
  require('./post'),
  require('./resSchema'),
]

module.exports = async function rest (req, res) {
  let context = req

  for (const step of steps) {
    context = await step(context)
    if (context.response) {
      return send(res, context)
    }
  }
  res.status(404).json({ error: 'not found' })
}