#!/usr/bin/env node

const chokidar = require('chokidar');
const { fork } = require('child_process');
const config = require(`${process.cwd()}/.cuchito/config.json`)

const serverHandlers = {
  REST: `${__dirname}/serverHandlers/REST/index.js`,
  graphql: `${__dirname}/serverHandlers/graphql/index.js`,
  ...config.serverHandlers
}

const servers = {};

function addServer(path) {
  const conf = require(path);
  
  if (!serverHandlers[conf.type]) {
    console.error(`Server Handler ${conf.type} for ${path} not found`)
    return;
  }

  servers[path] = fork(serverHandlers[conf.type], [], { cwd: path.replace(/config.js$/, '') });
}

function changeServer(path) {
  removeServer(path);
  addServer(path);
}

function removeServer(path) {
  delete require.cache(require.resolve(path));
  servers[path].kill();
}

function main() {
  const configWatched = chokidar.watch(`${process.cwd()}/.cuchito/*/config.js`, {
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