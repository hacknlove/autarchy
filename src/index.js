#!/usr/bin/env node

const yargs = require('yargs');

const options = yargs
  .option('i', {
    alias: 'init',
    describe: 'install and create initial config',
    type: 'boolean',
    demandOption: false,
    default: false,
  }).argv

if (options.i) {
  require('./install')
} else {
  require('./main')
}
