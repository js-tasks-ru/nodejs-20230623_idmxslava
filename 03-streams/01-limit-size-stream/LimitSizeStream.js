const stream = require("stream");
const LimitExceededError = require("./LimitExceededError");

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.dataSize = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.dataSize += chunk.length;
    if (this.dataSize > this.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
