const mongoose = require("mongoose");
const connection = require("../libs/connection");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: "User",
  },
  product: {
    type: mongoose.ObjectId,
    required: true,
    ref: "Product",
  },
  phone: {
    type: String,
    required: true,
    validate: [
      {
        validator(value) {
          return /\+?\d{6,14}/.test(value);
        },
        message: "Неверный формат номера телефона.",
      },
    ],
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = connection.model("Order", orderSchema);
