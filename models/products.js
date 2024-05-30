// const Sequelize = require("sequelize");
const { reviews: Reviews, colors } = require("../models");
// const Reviews = require("../models/reviews");
module.exports = function (sequelize, DataTypes) {
  const Products = sequelize.define(
    "products",
    {
      _id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      categoryA: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      categoryB: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      size: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      featured: {
        type: DataTypes.ENUM("available", "not available"),
        allowNull: true,
      },
      freeShipping: {
        type: DataTypes.ENUM("available", "not available"),
        allowNull: true,
      },
      inventory: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      averageRating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }, //
      numOfReviews: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      numOfTimesSold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      user: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "_id",
        },
      },
    },
    {
      sequelize,
      tableName: "products",
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
          fields: [{ name: "user" }],
        },
      ],
    }
  );

  Products.associate = function (models) {
    Products.hasOne(models.colors, { foreignKey: "productId" });
    Products.hasMany(models.reviews, { foreignKey: "productId" });
  };
  Products.afterDestroy(async (productInstance, options) => {
    const { _id } = productInstance;
    const productReviews = await Reviews.findAll({ where: { productId: _id } });
    console.log("Product Reviews for Deletion:", productReviews);

    await Reviews.destroy({ where: { productId: _id } });
  });
  return Products;
};
