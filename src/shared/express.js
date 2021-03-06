const http = require('http');
const express = require('express');

const app = express();

app.enable('trust proxy');
app.use(require('compression')());

function connect(conf) {
  const {
    local: {
      ip = '0.0.0.0',
      port = '80',
    } = {},
    remote,
  } = conf;

  express.server = http.createServer(app);
  express.server.listen(port, ip, e => {
    if (e) {
      console.error(e)
      process.exit(1)
    }
    console.log(`${conf.name}: ${ip}:${port} -> ${remote}`);
  });
}

exports.connect = connect;
exports.app = app;
