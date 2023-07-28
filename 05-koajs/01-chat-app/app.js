const path = require("path");
const Koa = require("koa");
const app = new Koa();

app.use(require("koa-static")(path.join(__dirname, "public")));
app.use(require("koa-bodyparser")());

const Router = require("koa-router");
const router = new Router();

class MessagesHandler {
  constructor() {
    this.subscribers = [];
  }

  subscribe = (subscriber) => {
    this.subscribers.push(subscriber);
  };

  publish = (body) => {
    for (let callback of this.subscribers) {
      callback(body.message);
    }
  };
}

const messageHandler = new MessagesHandler();

router.get("/subscribe", async (ctx, next) => {
  if (!ctx.subscribers) {
    ctx.state.subscribers = [];
  }
  const body = await new Promise(async (resolve, reject) => {
    return messageHandler.subscribe(resolve);
  });
  ctx.body = body;
});

router.post("/publish", async (ctx, next) => {
  if (!ctx.request.body.message) {
    ctx.body = "empty message";
    return;
  }
  messageHandler.publish(ctx.request.body);
  ctx.body = "published";
});

app.use(router.routes());

module.exports = app;
