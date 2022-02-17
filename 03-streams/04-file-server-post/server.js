const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.match(/\//g)) {
        res.statusCode = 400;
        res.end();
      } else {
        fs.access(filepath, (error)=>{
          if (error && error.code === 'ENOENT') {
            const limitedStream = new LimitSizeStream({limit: 100000, encoding: 'utf-8'});
            const stream = fs.createWriteStream(filepath);
            req
                .on('error', (error)=>{
                  if (error.code === 'ECONRESET') {
                    fs.unlink(filepath, (error)=>{});
                  }
                })
                .pipe(limitedStream)
                .on('error', (error)=>{
                  fs.unlink(filepath, ()=>{
                    res.statusCode = 413;
                    res.end();
                  });
                })
                .pipe(stream)
                .on('finish', ()=>{
                  res.statusCode = 201;
                  res.end();
                });

            req.on('aborted', ()=>{
              fs.unlink(filepath, (error)=>{});
            });
          } else {
            res.statusCode = 409;
            res.end();
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
