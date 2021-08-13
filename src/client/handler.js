const { resolve } = require('path')
const express = require('express')
const { conf } = require('./conf')

const proxy = require('../serverHandlers/REST/lib/proxy')
const send = require('../serverHandlers/REST/lib/send')

const app = express()
app.enable('trust proxy');
app.use(require('compression')())


async function handler (req, res) {
  const service = conf[req.hostname]

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
app.listen(resolve(__dirname, '.express'))

