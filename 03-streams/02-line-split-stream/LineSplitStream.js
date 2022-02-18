const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.data = '';
  }

  _transform(chunk, encoding, callback) {
    this.data = this.data.concat(chunk.toString('utf-8'));
    const lines = this.data.split(os.EOL);
    if (lines.length > 1) {
      for (let i =0; i<lines.length-1; i++) {
        const line = lines[i];
        this.push(line);
      }
      this.data = lines[lines.length - 1];
    }
    callback();
  }

  _flush(callback) {
    this.push(this.data);
    callback();
  }
}

module.exports = LineSplitStream;
