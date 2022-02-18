const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.match(/\//g)) {
        res.statusCode = 400;
        res.end();
      } else {
        fs.unlink(filepath, (error)=>{
          if (error && error.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('not found');
          } else {
            res.statusCode = 200;
            res.end('deleted');
          }
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
