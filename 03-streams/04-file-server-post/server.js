const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const {access} = require('fs/promises');
const {pipeline} = require('stream');

const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  if (pathname.match(/\//g)) {
    res.statusCode = 400;
    res.end();
  }
  switch (req.method) {
    case 'POST':
      const limitedStream = new LimitSizeStream({limit: 100000, encoding: 'utf-8'});
      access(filepath)
          .then(()=>{
            res.statusCode = 409;
            res.end('Файл уже существует');
          })
          .catch((error)=>{
            if (error.code === 'ENOENT') {
              const stream = fs.createWriteStream(filepath);
              pipeline(req,
                  limitedStream,
                  stream,
                  (err)=>{
                    if (err) {
                      if (err.code === 'LIMIT_EXCEEDED') {
                        res.statusCode = 413;
                      }
                      fs.unlink(filepath, ()=> {});
                      res.end();
                    } else {
                      res.statusCode = 201;
                      res.end();
                    }
                  });
            }
          });
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
