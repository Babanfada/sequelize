const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const deliveryaddress = sequelize.define(
    "deliveryaddress",
    {
      _id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      street: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "orders",
          key: "_id",
        },
      },
    },
    {
      sequelize,
      tableName: "deliveryaddress",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "_id" }],
        },
        {
          name: "order",
          using: "BTREE",
          fields: [{ name: "orderId" }],
        },
      ],
    }
  );

  deliveryaddress.associate = function (models) {
    deliveryaddress.belongsTo(models.orders);
  };

  return deliveryaddress;
};
