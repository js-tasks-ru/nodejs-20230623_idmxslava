const Product = require("../models/Product");
const productMapper = require("../mappers/product");

module.exports.productsBySubcategory = async function productsBySubcategory(
  ctx,
  next
) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();
  const products = (await Product.find({ subcategory })).map((product) =>
    productMapper(product)
  );
  ctx.body = { products };
};

module.exports.productList = async function productList(ctx, next) {
  const products = (await Product.find()).map((product) =>
    productMapper(product)
  );
  ctx.body = { products };
};

module.exports.productById = async function productById(ctx, next) {
  const product = await Product.findById(ctx.params.id);
  if (!product) {
    ctx.throw(404, "not found");
  }
  ctx.body = { product: productMapper(product) };
};
