const crypto = require('crypto');
const { createConnection } = require('net');
const { resolve } = require('path');
require('./client');

const algorithm = 'aes-256-ctr';
const key = process.env.PASSWORD;
const secret = process.env.SECRET;
let serverConfig


function start ({ port, host }) {
  serverConfig = { port, host }
  console.log('Conecting...')
  const socket = createConnection(port, host)
  
  socket.on('connect', () => {
    console.log('conected')
  })

  socket.on('close', () => {
    console.log('disconected. Retrying on 5 seconds')
    setTimeout(start, 5000)
  })

  socket.on('data', proxy)
}

function proxy (iv) {
  const socket = createConnection(serverConfig.port, serverConfig.host)
  const expressSocket = createConnection(resolve(__dirname, '.express'))

  const ivDown = crypto.createHash('sha256').update(secret).update(iv).digest();
  const ivUp = crypto.createHash('sha256').update(iv).update(secret).digest();

  const encrypt = crypto.createCipheriv(algorithm, key, ivUp) 
  const decrypt = crypto.createDecipheriv(algorithm, key, ivDown)

  socket.pipe(decrypt).pipe(expressSocket)
  expressSocket.pipe(encrypt).pipe(socket)
}

module.exports = start