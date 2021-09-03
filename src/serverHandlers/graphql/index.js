const express = require('express');
const { app, connect } = require('../../shared/express');
require('../../shared/logger')('..')

const { conf } = require('./lib/conf');

require('../../shared/cors')(conf, app)

app.use(express.json());
app.use(require('./lib/graphql'));

connect(conf);
