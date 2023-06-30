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
  const sendCodeMessage = sendMessage(res);

  switch (req.method) {
    case "DELETE":
      try {
        if (pathname.includes("/")) {
          sendCodeMessage("bad request", 400);
          break;
        }
        if (!fs.existsSync(filepath)) {
          sendCodeMessage("file not found", 404);
          break;
        }

        fs.unlinkSync(filepath);

        sendCodeMessage("ok", 200);
      } catch (e) {
        sendCodeMessage("Something went wrong", 500);
      }
      break;

    default:
      sendCodeMessage("Not implemented", 501);
  }
});

module.exports = server;
