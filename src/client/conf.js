const glob = require('glob');
const chokidar = require('chokidar');

const conf = {}

function addFile(path) {
  const { match, local } = require(path)

  if (!match) {
    return
  }

  conf[path] = { match, local }
}

function removeFile(path) {
  delete conf[path]

  delete require.cache[require.resolve(path)];
}

function changeFile(path) {
  removeFile(path);
  addFile(path);
}

glob.sync(`${process.cwd()}/.autarchy/*/config.js`).forEach((path) => addFile(path, false));

function live() {
  const endpointsWatched = chokidar.watch(`${process.cwd()}/.autarchy/*/config.js`, {
    ignoreInitial: true, awaitWriteFinish: true, usePolling: true, interval: 1000,
  });

  endpointsWatched.on('add', (path) => addFile(path));

  endpointsWatched.on('change', changeFile);

  endpointsWatched.on('unlink', (path) => removeFile(path));
}

live();

exports.conf = conf;
