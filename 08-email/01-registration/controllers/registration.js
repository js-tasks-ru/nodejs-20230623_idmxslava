const { v4: uuid } = require("uuid");
const User = require("../models/User");
const sendMail = require("../libs/sendMail");

module.exports.register = async (ctx, next) => {
  const token = uuid();
  const { email, displayName, password } = ctx.request.body;
  try {
    const user = await User.create({
      email,
      displayName,
      verificationToken: token,
    });
    await user.setPassword(password);
    await user.save();
    await sendMail({
      template: "confirmation",
      locals: { token },
      to: email,
      subject: "Подтвердите почту",
    });
    ctx.body = { status: "ok" };
  } catch (e) {
    ctx.throw(400, e);
  }
};

module.exports.confirm = async (ctx, next) => {
  try {
    const user = await User.findOne({
      verificationToken: ctx.request.body.verificationToken,
    });
    if (!user) {
      ctx.throw(404, "Ссылка подтверждения недействительна или устарела");
    }
    user.verificationToken = undefined;
    await user.save();
    const token = uuid();
    ctx.body = { token };
  } catch (e) {
    ctx.throw(400, e);
  }
};
