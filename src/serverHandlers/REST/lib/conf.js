const { resolve } = require('path')
const glob = require('glob');
const { match, compile } = require('path-to-regexp');
const chokidar = require('chokidar');
const { defecto } = require('../../../shared/conf');


const configPath = process.cwd(); 
const prefix = resolve(configPath, 'endpoints');

const conf = {
  ...defecto,
  toQuery: [
    ({
      request: {
        path, params, method, body, query,
      }
    }) => ({
      'request.path': path,
      'request.params': params,
      'request.method': method,
      'request.body': body,
      'request.query': query,
    })
  ],
  ...require(resolve(configPath, 'config.js')),
  endpoints: [],
};


const regexp = new RegExp(`^${prefix}(/.*)\\.([A-Z]+|all)\\.js$`);

const paths = {};

function updateEndpoints() {
  conf.endpoints = Object.values(paths).sort((a, b) => (a.path.replace(/\/\[/g, '/￿') < b.path.replace(/\/\[/g, '/￿') ? -1 : 1));
}

function addFile(path, update) {
  const parse = path.match(regexp);
  if (!parse) {
    return;
  }
  const key = `${parse[1]}/${parse[2]}`;

  paths[key] = {
    match: match(parse[1].replace(/\[(\w*)\]/g, ':$1'), { decode: decodeURIComponent }),
    path: parse[1],
    compile: compile(parse[1].replace(/\[(\w*)\]/g, ':$1'), { encode: encodeURIComponent }),
    method: parse[2],
    conf: require(path),
  };

  if (update) {
    updateEndpoints();
  }
}

function removeFile(path, update) {
  const parse = path.match(regexp);
  if (!parse) {
    return;
  }
  const key = `${parse[1]}/${parse[2]}`;
  delete paths[key];
  delete require.cache[require.resolve(path)];
  if (update) {
    updateEndpoints();
  }
}

function changeFile(path) {
  removeFile(path);
  addFile(path, true);
}

glob.sync(`${prefix}/**/*.js`).filter((file) => regexp.test(file)).forEach((path) => addFile(path, false));
updateEndpoints();

function live() {
  const endpointsWatched = chokidar.watch(`${prefix}/**.js`, {
    ignoreInitial: true, awaitWriteFinish: true, usePolling: true, interval: 1000,
  });

  endpointsWatched.on('add', (path) => addFile(path, true));

  endpointsWatched.on('change', changeFile);

  endpointsWatched.on('unlink', (path) => removeFile(path, true));
}

live();

exports.conf = conf;
