const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    const {limit} = options;
    this.limit = limit;
    this.bytesTransfered = 0;
  }

  _transform(chunk, encoding, callback) {
    this.bytesTransfered += chunk.length;
    if (this.bytesTransfered > this.limit) {
      callback(new LimitExceededError(), chunk);
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
