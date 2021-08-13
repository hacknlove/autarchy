const express = require('express')
const { conf } = require('./conf')

const proxy = require('../serverHandlers/REST/lib/proxy')
const send = require('../serverHandlers/REST/lib/send')

const app = express()
app.enable('trust proxy');
app.use(require('compression')())

const unixSocket = '/tmp/' + Date.now() + Math.random()

async function handler (req, res) {
  const service = conf[req.hostname || req.get('host')]

  if (!service) {
    res.status(404)
    res.end()
    return
  }

  send(res, await proxy({
    conf: {
      remote: `http://localhost:${service.local.port || 1989}`

    },
    request: req
  }))

}

app.use(handler)
app.listen(unixSocket)

module.exports = unixSocket