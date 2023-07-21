const Category = require("../models/Category");
const categoriesMapper = require("../mappers/category");

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = (await Category.find()).map((category) =>
    categoriesMapper(category)
  );
  ctx.body = { categories };
};
