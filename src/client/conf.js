const glob = require('glob');
const chokidar = require('chokidar');

const conf = {}

const pathToDomain = {}

function addFile(path) {
  const service = require(path)

  if (!service.domain) {
    return
  }
  if (conf[service.domain]) {
    console.error('Two services cannot share the same domain', service.domain)
  }

  conf[service.domain] = service
  pathToDomain[path] = service.domain
}

function removeFile(path) {
  const domain = pathToDomain[path]

  if (!domain) {
    return
  }

  delete pathToDomain[path]
  delete conf[domain]

  delete require.cache[require.resolve(path)];
}

function changeFile(path) {
  removeFile(path);
  addFile(path);
}

glob.sync(`${process.cwd()}/.autharchy/*/config.js`).forEach((path) => addFile(path, false));

function live() {
  const endpointsWatched = chokidar.watch(`${process.cwd()}/.autharchy/*/config.js`, {
    ignoreInitial: true, awaitWriteFinish: true, usePolling: true, interval: 1000,
  });

  endpointsWatched.on('add', (path) => addFile(path));

  endpointsWatched.on('change', changeFile);

  endpointsWatched.on('unlink', (path) => removeFile(path));
}

live();

exports.conf = conf;
