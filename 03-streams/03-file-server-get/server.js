const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { sendMessage } = require("../../helpers/sendMessage.js");

const server = new http.Server();

server.on("request", (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, "files", pathname);

  const sendErrorMessage = sendMessage(res);

  switch (req.method) {
    case "GET":
      if (pathname.includes("/")) {
        sendErrorMessage("bad request", 400);
        break;
      }
      const outStream = fs.createReadStream(filepath);
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
