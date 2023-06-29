const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");

const server = new http.Server();

const sendError = (res) => (message, code) => {
  res.statusCode = code;
  res.end(message);
};

server.on("request", (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, "files", pathname);
  const outStream = fs.createReadStream(filepath);

  const sendErrorMessage = sendError(res);

  switch (req.method) {
    case "GET":
      if (pathname.includes("/")) {
        sendErrorMessage("bad request", 400);
      }
      outStream.pipe(res);
      outStream.on("error", (error) => {
        if (error.code === "ENOENT") {
          sendErrorMessage("file not found", 404);
        }
      });
      req.on("aborted", () => outStream.destroy());
      break;

    default:
      sendErrorMessage("Not implemented", 501);
  }
});

module.exports = server;
