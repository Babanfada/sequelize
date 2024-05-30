var DataTypes = require("sequelize").DataTypes;
var _advert = require("./advert");
var _colors = require("./colors");
var _deliveryaddress = require("./deliveryaddress");
var _order_items = require("./order_items");
var _orders = require("./orders");
var _productimages = require("./productimages");
var _products = require("./products");
var _promotion = require("./promotion");
var _review_images = require("./review_images");
var _reviews = require("./reviews");
var _token = require("./token");
var _userorders = require("./userorders");
var _users = require("./users");

function initModels(sequelize) {
  var advert = _advert(sequelize, DataTypes);
  var colors = _colors(sequelize, DataTypes);
  var deliveryaddress = _deliveryaddress(sequelize, DataTypes);
  var order_items = _order_items(sequelize, DataTypes);
  var orders = _orders(sequelize, DataTypes);
  var productimages = _productimages(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var promotion = _promotion(sequelize, DataTypes);
  var review_images = _review_images(sequelize, DataTypes);
  var reviews = _reviews(sequelize, DataTypes);
  var token = _token(sequelize, DataTypes);
  var userorders = _userorders(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  deliveryaddress.belongsTo(orders, { as: "order_order", foreignKey: "order"});
  orders.hasMany(deliveryaddress, { as: "deliveryaddresses", foreignKey: "order"});
  order_items.belongsTo(orders, { as: "order_order", foreignKey: "order"});
  orders.hasMany(order_items, { as: "order_items", foreignKey: "order"});
  colors.belongsTo(products, { as: "product_product", foreignKey: "product"});
  products.hasMany(colors, { as: "colors", foreignKey: "product"});
  order_items.belongsTo(products, { as: "product_product", foreignKey: "product"});
  products.hasMany(order_items, { as: "order_items", foreignKey: "product"});
  productimages.belongsTo(products, { as: "product_product", foreignKey: "product"});
  products.hasMany(productimages, { as: "productimages", foreignKey: "product"});
  reviews.belongsTo(products, { as: "product_product", foreignKey: "product"});
  products.hasMany(reviews, { as: "reviews", foreignKey: "product"});
  review_images.belongsTo(reviews, { as: "user_review", foreignKey: "user"});
  reviews.hasMany(review_images, { as: "review_images", foreignKey: "user"});
  review_images.belongsTo(reviews, { as: "product_review", foreignKey: "product"});
  reviews.hasMany(review_images, { as: "product_review_images", foreignKey: "product"});
  advert.belongsTo(users, { as: "user_user", foreignKey: "user"});
  users.hasMany(advert, { as: "adverts", foreignKey: "user"});
  orders.belongsTo(users, { as: "user_user", foreignKey: "user"});
  users.hasMany(orders, { as: "orders", foreignKey: "user"});
  products.belongsTo(users, { as: "user_user", foreignKey: "user"});
  users.hasMany(products, { as: "products", foreignKey: "user"});
  promotion.belongsTo(users, { as: "user_user", foreignKey: "user"});
  users.hasMany(promotion, { as: "promotions", foreignKey: "user"});
  reviews.belongsTo(users, { as: "user_user", foreignKey: "user"});
  users.hasMany(reviews, { as: "reviews", foreignKey: "user"});
  token.belongsTo(users, { as: "user_user", foreignKey: "user"});
  users.hasMany(token, { as: "tokens", foreignKey: "user"});
  userorders.belongsTo(users, { as: "user_user", foreignKey: "user"});
  users.hasMany(userorders, { as: "userorders", foreignKey: "user"});

  return {
    advert,
    colors,
    deliveryaddress,
    order_items,
    orders,
    productimages,
    products,
    promotion,
    review_images,
    reviews,
    token,
    userorders,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
