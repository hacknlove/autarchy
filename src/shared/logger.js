const pino = require('pino')
const { resolve } = require('path')

var logger

module.exports = function getLogger(path) {
  if (logger) {
    return logger
  }

  const conf = require(resolve(process.cwd(), path, 'config.js'))

  if (conf.transport) {
    pino.transport(conf.transport)
  }
   
  logger = pino({
    level: 'trace',
    prettyPrint: { colorize: true },
    ...conf.pino
  })

  return logger;
}
