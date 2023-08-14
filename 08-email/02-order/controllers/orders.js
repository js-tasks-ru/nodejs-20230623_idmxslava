const Order = require("../models/Order");
const sendMail = require("../libs/sendMail");
const Product = require("../models/Product");
const mapOrder = require("../mappers/order");
const mapOrderConfirmation = require("../mappers/orderConfirmation");

module.exports.checkout = async function checkout(ctx, next) {
  const { product, phone, address } = ctx.request.body;
  const order = await Order.create({
    product,
    phone,
    address,
    user: ctx.user.id,
  });
  const productFromDB = await Product.findById(product);
  await sendMail({
    template: "order-confirmation",
    locals: mapOrderConfirmation(order, productFromDB),
    to: ctx.user.email,
    subject: "Заказ создан, необходимо подтверждение",
  });
  ctx.type = "application/json";
  ctx.body = { order: order.id };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = (await Order.find({ user: ctx.user }).populate("product")).map(
    mapOrder
  );
  ctx.type = "application/json";
  ctx.body = { orders };
};
