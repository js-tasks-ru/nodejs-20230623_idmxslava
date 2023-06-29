const stream = require("stream");
const os = require("os");

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.lastSlice = "";
  }

  _transform(chunk, encoding, callback) {
    const formattedChunk = this.lastSlice + chunk.toString(this.encoding);
    const splittedChunk = formattedChunk.split(os.EOL);
    this.lastSlice = splittedChunk.pop();

    for (const slicedChunk of splittedChunk) {
      this.push(slicedChunk);
    }
    callback(null);
  }

  _flush(callback) {
    this.lastSlice && this.push(this.lastSlice);
    callback(null);
  }
}

module.exports = LineSplitStream;
