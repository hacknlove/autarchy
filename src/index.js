#!/usr/bin/env node

const yargs = require('yargs');

const options = yargs
  .option('i', {
    alias: 'init',
    describe: 'install and create initial config',
    type: 'boolean',
    demandOption: false,
    default: false,
  })
  .option('p', {
    alias: 'package-manager',
    describe: 'package manager',
    type: 'string',
    default: 'npm'
  }).argv

if (options.i) {
  require('./install')(options.p)
} else {
  require('./main')
}
