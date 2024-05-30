const Sequelize = require("sequelize");
const Products = require("../models/products");
// const { Products } = require("../models");
module.exports = function (sequelize, DataTypes) {
  const colors = sequelize.define(
    "colors",
    {
      _id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "products",
          key: "_id",
        },
      },
      color0: {
        type: DataTypes.STRING(7),
        allowNull: true,
      },
      color1: {
        type: DataTypes.STRING(7),
        allowNull: true,
      },
      color2: {
        type: DataTypes.STRING(7),
        allowNull: true,
      },
      color3: {
        type: DataTypes.STRING(7),
        allowNull: true,
      },
      color4: {
        type: DataTypes.STRING(7),
        allowNull: true,
      },
      color5: {
        type: DataTypes.STRING(7),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "colors",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "_id" }],
        },
        {
          name: "product_id",
          using: "BTREE",
          fields: [{ name: "productId" }],
        },
      ],
    }
  );
  colors.associate = function (models) {
    colors.belongsTo(models.products);
  };

  return colors;
};
