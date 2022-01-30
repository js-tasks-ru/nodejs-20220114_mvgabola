const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  switch (req.method) {
    case 'GET':
      if (pathname.match(/\//g)) {
        res.statusCode = 400;
        res.end();
      }
      const stream = fs.createReadStream(filepath);
      stream.on('error', (error)=>{
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end();
        }
        res.statusCode = 500;
        res.end();
      });
      stream.pipe(res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
