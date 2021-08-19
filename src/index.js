#!/usr/bin/env node

const chokidar = require('chokidar')
const { fork } = require('child_process')
const config = require(`${process.cwd()}/.autarchy/config.js`)
const mongoProxy = require('./shared/mongoProxy')
const exitHook = require('exit-hook');

if (config.server) {
  const client = require('./client')
  client(config.server)
}

const serverHandlers = {
  REST: `${__dirname}/serverHandlers/REST/index.js`,
  graphql: `${__dirname}/serverHandlers/graphql/index.js`,
  ...config.serverHandlers
}

const servers = {};

function pathToName (path) {
  return path.match(/([^/]*)\/config\.js$/)[1]
}

async function addServer(path) {
  const conf = require(path);

  if (conf.type === 'none') {
    return
  }

  if (!serverHandlers[conf.type]) {
    console.error(`Server Handler ${conf.type} for ${path} not found`)
    return;
  }

  console.log(`add ${conf.type} server for ${path}`)

  servers[path] = fork(serverHandlers[conf.type], [], { cwd: path.replace(/config.js$/, '') });
  await mongoProxy.waitFor
  await mongoProxy.services.insertOne({ name: conf.name || pathToName(path), type: conf.type })
}

async function changeServer(path) {
  await removeServer(path);
  addServer(path);
}

async function removeServer(path) {
  const conf = require(path);

  delete require.cache[require.resolve(path)];
  if (servers[path]) {
    servers[path].kill();
    await mongoProxy.waitFor
    await mongoProxy.services.deleteOne({ name: conf.name || pathToName(path), type: conf.type })
  }
}

async function main() {
  console.log('connecting with the database')
  await mongoProxy.waitFor
  await mongoProxy.services.deleteMany({})

  const configWatched = chokidar.watch(`${process.cwd()}/.autarchy/*/config.js`, {
    ignoreInitial: false,
    awaitWriteFinish: true,
    usePolling: true,
    interval: 1000,
  });

  configWatched.on('add', addServer);

  configWatched.on('change', changeServer);

  configWatched.on('unlink', removeServer);
}

main()

exitHook(() => {
  Object.values(servers).forEach(p => p.kill())
	console.log('Exiting');
});