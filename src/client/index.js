const crypto = require('crypto');
const { createConnection } = require('net');
const unixSocket = require('./handler')

const algorithm = 'aes-256-ctr';
const password = process.env.PASSWORD;
const secret = process.env.SECRET;
let serverConfig


function start ({ port, host }) {
  serverConfig = { port, host }
  console.log(`Conecting to ${host}:${port}`)
  const socket = createConnection(port, host)
  
  socket.on('connect', () => {
    console.log('conected')
  })

  socket.on('close', () => {
    console.log('disconected. Retrying on 5 seconds')
    setTimeout(() => start(serverConfig), 5000)
  })

  socket.on('data', proxy)

  socket.on('error', () => {
    console.error(`Cannot connect to ${host}:${port}`)
    process.exit(1)
  })
}

function proxy (iv) {
  const socket = createConnection(serverConfig.port, serverConfig.host)
  const expressSocket = createConnection(unixSocket)

  const hash = crypto.createHash('sha512').update(secret).update(iv).update(password).digest() 
  const key = hash.slice(0, 32);
  const ivDown = hash.slice(32, 48);
  const ivUp = hash.slice(48, 64);

  const encrypt = crypto.createCipheriv(algorithm, key, ivUp) 
  const decrypt = crypto.createDecipheriv(algorithm, key, ivDown)

  socket.pipe(decrypt).pipe(expressSocket)
  expressSocket.pipe(encrypt).pipe(socket)
}

module.exports = start
