#!/usr/bin/env node

const chokidar = require('chokidar');
const { fork, spawn } = require('child_process');
const config = require(`${process.cwd()}/.autharchy/config.js`)
const { resolve } = require('path');
const mongoProxy = require('./shared/mongoProxy');

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
    await mongoProxy.delete({ name: conf.name || pathToName(path), type: conf.type })
  }
}

async function main() {
  await mongoProxy.waitFor
  await mongoProxy.services.deleteMany({})

  const configWatched = chokidar.watch(`${process.cwd()}/.autharchy/*/config.js`, {
    ignoreInitial: false,
    awaitWriteFinish: true,
    usePolling: true,
    interval: 1000,
  });

  configWatched.on('add', addServer);

  configWatched.on('change', changeServer);

  configWatched.on('unlink', removeServer);


  console.log(resolve(__dirname, '..', 'webapp'))

  if (config.webapp) {
    console.log(`Launching webapp at http://localhost:${config.webapp}`)
    const webapp = spawn('npm', ['run', 'start', '--scripts-prepend-node-path'], {
      shell: true,
      cwd: resolve(__dirname, '..', 'webapp'),
      env: {
        MONGO_URL: process.env.AUTHARCHY_MONGO_URL || 'mongodb://localhost:27017/autharchy',
        PORT: config.webapp,
      } 
    })
    webapp.stdout.on('data', (data) => {
      console.log(`webapp: ${data}`)
    });
    
    webapp.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
    });
  }
}

main()