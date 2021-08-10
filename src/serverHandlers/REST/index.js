const express = require('express');
const { app, connect } = require('../../shared/express');
const { conf } = require('./lib/conf');

async function main() {
  app.use(express.json());

  app.use(require('./lib/rest'));

  connect(conf);
}

main();