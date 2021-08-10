const glob = require('glob');
const { match, compile } = require('path-to-regexp');
const chokidar = require('chokidar');


const configPath = `${process.cwd()}/${process.argv[2]}`; 
const prefix = `${configPath.replace(/config.js$/, '')}/endpoints`;

const defecto = {
  name: process.argv[2].match(/([^/]*)\/config.js$/)[1],
  remote: null,
  local: {
    ip: '0.0.0.0',
    port: 1989,
  },
  toQuery: [
    ({
      request: {
        path, params, method, body, query,
      }
    }) => ({
      path, params, method, body, query,
    })
  ],
  toDocument: (context) => ({
    ...context.request,
    response: context.response
  })
};

const conf = {
  ...defecto,
  ...require(configPath),
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
