const crypto = require('crypto');
const { createConnection } = require('net');
const unixSocket = require('./handler')

const algorithm = 'aes-256-ctr';
const secret = process.env.AUTARCHY_SECRET;
const clientId = process.env.AUTARCHY_CLIENT_ID;
if (!clientId || clientId.length !== 8) {
  console.error('CLIENTID should be 8 characters longth exactly')
  process.exit(1)
}

let serverConfig

function start (config) {
  const { port, host } = serverConfig = config

  console.log(`Conecting to ${host}:${port}`)
  const socket = createConnection(port, host)

  socket.on('connect', () => {
    console.log('conected')
    socket.write(clientId)
  })

  socket.on('close', () => {
    console.log('disconected. Retrying on 5 seconds')
    setTimeout(() => start(config), 5000)
  })

  socket.on('data', proxy)

  socket.on('error', () => {
    console.error(`Cannot connect to ${host}:${port}`)
    process.exit(1)
  })
}

function proxy (requestId) {
  if (requestId.length > 4) {
    const firstRequestId = requestId.subarray(0, 4)
    const restRequestId = requestId.subarray(4)

    proxy(firstRequestId)
    proxy(restRequestId)
    return
  }
  const socket = createConnection(serverConfig.port, serverConfig.host)
  console.log(clientId, requestId.toString('hex'))
  const iv = crypto.randomBytes(32)
  socket.write(clientId)
  socket.write(requestId)
  socket.write(iv)
  
  const expressSocket = createConnection(unixSocket)

  const hash = crypto.createHash('sha512')
    .update(secret)
    .update(requestId.toString('hex'))
    .update(iv)
    .digest()
  
  const key = hash.slice(0, 32);
  const ivDown = hash.slice(32, 48);
  const ivUp = hash.slice(48, 64);

  const encrypt = crypto.createCipheriv(algorithm, key, ivUp) 
  const decrypt = crypto.createDecipheriv(algorithm, key, ivDown)

  socket.pipe(decrypt).pipe(expressSocket)
  expressSocket.pipe(encrypt).pipe(socket)
}

module.exports = start
