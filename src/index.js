#!/usr/bin/env node
const config = require(`${process.cwd()}/.autarchy/config.js`)
const chokidar = require('chokidar')
const { fork, exec, execSync } = require('child_process')
const mongoProxy = require('./shared/mongoProxy')
const exitHook = require('exit-hook');
const logger = require('./shared/logger')('.autarchy');

if (config.server) {
  const client = require('./client')
  client(config.server)
}

async function runCommands (commands) {
  if (Array.isArray(commands)) {
    for (const command of commands) {
      const childLogger = logger.child({ command: command.cmd || command })
      await new Promise(resolve => {
        let theProcess
        if (typeof command === 'string') {
          childLogger.info({ command }, 'launching')
          theProcess = exec(command, resolve)
        } else {
          const { cmd, ...options } = command
          childLogger.info('launching command')
          theProcess = exec(cmd, options, resolve)
        }

        theProcess.stdout.on('data', (data) => {
          childLogger.debug(data)
        })
        theProcess.stderr.on('data', (data) => {
          childLogger.trace(data)
        })
      })
      childLogger.info('Finished')
    }
  }
}

function runSyncCommands (commands) {
  if (Array.isArray(commands)) {
    for (const command of commands) {
        const childLogger = logger.child({ command: command.cmd || command })
        let theProcess
        if (typeof command === 'string') {
          logger.info({ command }, 'launching command')
          theProcess = execSync(command)
        } else {
          const { cmd, ...options } = command
          childLogger.info(command, 'launching command')
          theProcess = execSync(cmd, options)
        }

        childLogger.info(theProcess.toString('utf-8'))
    }
  }
}


const serverHandlers = {
  REST: `${__dirname}/serverHandlers/REST/index.js`,
  graphql: `${__dirname}/serverHandlers/graphql/index.js`,
  ...config.serverHandlers
}

const servers = {};
const processes = {};

function pathToName (path) {
  return path.match(/([^/]*)\/config\.js$/)[1]
}

async function addServer(path) {
  const conf = require(path);

  if (conf.start) {
    const childLogger = logger.child({ server: path })
    childLogger.info(conf.start.cmd)
    processes[path] = exec(conf.start.cmd, { env: conf.start.env })
    processes[path].stdout.on('data', (data) => {
      childLogger.debug(data)
    })
    processes[path].stderr.on('data', (data) => {
      childLogger.trace(data)
    })
    await mongoProxy.waitFor
    await mongoProxy.processes.insertOne({ name: conf.name || pathToName(path), ...conf.start })  
  }

  if (conf.type === 'none') {
    return
  }



  if (!serverHandlers[conf.type]) {
    logger.warn(`Server Handler ${conf.type} for ${path} not found`)
    return;
  }

  logger.info(`add ${conf.type} server for ${path}`)

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
  if (processes[path]) {
    processes[path].kill();
    await mongoProxy.waitFor
    await mongoProxy.processes.deleteOne({ name: conf.name || pathToName(path), ...conf.start })
  }

}

async function main() {
  await runCommands(config.startup)
  logger.info('connecting with the database')
  await mongoProxy.waitFor
  await mongoProxy.services.deleteMany({})
  logger.info('connected!')

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

exitHook(async () => {
	logger.info('Exiting');
  Object.values(servers).forEach(p => p.kill())
  Object.values(processes).forEach(p => p.kill())
  runSyncCommands(config.tearDown)
});