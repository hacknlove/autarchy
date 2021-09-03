const express = require('express')
const { conf } = require('./conf')

const proxy = require('../serverHandlers/REST/lib/proxy')
const send = require('../serverHandlers/REST/lib/send')

const app = express()
app.enable('trust proxy');
app.use(require('compression')())
app.use(express.raw())
app.use(express.text())
app.use(express.json())
const unixSocket = '/tmp/' + Date.now() + Math.random()

async function handler (req, res) {
  const originalRequest = {
    path: req.path,
    params: {},
    headers: req.headers,
    method: req.method,
    body: req.body,
    query: req.query,
  }

  let request

  const service = Object.values(conf).find(({ match }) => request = (typeof match === 'function') && match(originalRequest))

  if (!service) {
    res.status(404)
    res.end()
    return
  }

  send(res, await proxy({
    conf: {
      remote: `http://localhost:${service.local.port || 1989}`

    },
    request
  }))

}

app.use(handler)
app.listen(unixSocket)

module.exports = unixSocket