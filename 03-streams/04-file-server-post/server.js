const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { sendMessage } = require("../../helpers/sendMessage.js");
const LimitSizeStream = require("./LimitSizeStream.js");

const server = new http.Server();

server.on("request", (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, "files", pathname);

  const sendCodeMessage = sendMessage(res);

  switch (req.method) {
    case "POST":
      if (pathname.includes("/")) {
        sendCodeMessage("bad request", 400);
        break;
      }
      if (fs.existsSync(filepath)) {
        sendCodeMessage("file is exist", 409);
        break;
      }
      const limitedStream = new LimitSizeStream({ limit: 1048576 });
      const outStream = fs.createWriteStream(filepath);
      limitedStream.pipe(outStream);

      req.pipe(limitedStream);

      req.on("aborted", () => {
        fs.unlinkSync(filepath);
        limitedStream.destroy();
        outStream.destroy();
      });
      outStream.on("error", (error) => {
        if (error.code === "ENOENT") {
          sendCodeMessage("file not found", 404);
        } else sendCodeMessage("something went wrong", 500);
      });
      outStream.on("finish", () => {
        sendCodeMessage("ok", 201);
      });
      limitedStream.on("error", (error) => {
        if (error.code === "LIMIT_EXCEEDED") {
          outStream.destroy();
          fs.unlinkSync(filepath);
          sendCodeMessage("file so large", 413);
        } else sendCodeMessage("something went wrong", 500);
      });
      break;

    default:
      sendCodeMessage("Not implemented", 501);
  }
});

module.exports = server;
