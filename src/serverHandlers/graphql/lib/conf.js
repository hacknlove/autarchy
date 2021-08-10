const glob = require('glob');
const chokidar = require('chokidar');

const configPath = `${process.cwd()}/${process.argv[2]}`;

const defecto = {
  remote: null,
  local: {
    ip: '0.0.0.0',
    port: 1989,
  },
  toQuery: [
    ({
      graphql: {
        query, variable,
      }
    }) => ({
      query, variable,
    })
  ],
  toDocument: (context) => ({
    ...context.graphql,
    request: context.request,
    response: context.response
  })
};

const prefix = `${configPath.replace(/config.js$/, '')}/queries`;

const paths = {};

const conf = {
  ...defecto,
  ...require(configPath),
  queries: [],
};

function updateQueries() {
  conf.queries = Object.values(paths).sort((a, b) => (a.path < b.path ? -1 : 1));
}

function addFile(path, update) {
  const { match, conf } = require(path);

  paths[path] = {
    path,
    match,
    conf,
  };

  if (update) {
    updateQueries();
  }
}

function removeFile(path, update) {
  delete paths[path];
  delete require.cache[require.resolve(path)];
  if (update) {
    updateQueries();
  }
}

function changeFile(path) {
  removeFile(path);
  addFile(path, true);
}

glob.sync(`${prefix}/**/*.js`).forEach((path) => addFile(path, false));
updateQueries();

function live() {
  const queryWatched = chokidar.watch(`${prefix}/**.js`, {
    ignoreInitial: true, awaitWriteFinish: true, usePolling: true, interval: 1000,
  });

  queryWatched.on('add', (path) => addFile(path, true));

  queryWatched.on('change', changeFile);

  queryWatched.on('unlink', (path) => removeFile(path, true));
}

live();

exports.conf = conf;
