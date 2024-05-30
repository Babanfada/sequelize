const Sequelize = require("sequelize");
const Products = require("../models/products");
module.exports = function (sequelize, DataTypes) {
  const Reviews = sequelize.define(
    "reviews",
    {
      _id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "_id",
        },
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "products",
          key: "_id",
        },
      },
    },
    {
      sequelize,
      tableName: "reviews",
      hasTrigger: true,
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "_id" }],
        },
        {
          name: "user",
          using: "BTREE",
          fields: [{ name: "userId" }],
        },
        {
          name: "product",
          using: "BTREE",
          fields: [{ name: "productId" }],
        },
      ],
    }
  );
  Reviews.associate = function (models) {
    Reviews.belongsTo(models.products);
    Reviews.belongsTo(models.users);
  };
  // Reviews.hasOne(sequelize.models.products, { foreignKey: "user" });
  // Reviews.hasOne(sequelize.models.products, { foreignKey: "product" });
  //  Reviews.belongsTo(sequelize.models.products, { foreignKey: "productId" }); // Change the foreignKey here
  // Reviews.belongsTo(sequelize.models.products, { foreignKey: "productId" });
  // Products.hasOne(Reviews, { foreignKey: "productId" });
  // Products.hasMany(Reviews, { foreignKey: "productId" });
  return Reviews;
};
