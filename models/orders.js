const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const orders = sequelize.define(
    "orders",
    {
      _id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      tax: {
        type: DataTypes.DECIMAL(60, 4),
        allowNull: false,
      },
      shippingFee: {
        type: DataTypes.DECIMAL(60, 4),
        allowNull: false,
      },
      subTotal: {
        type: DataTypes.DECIMAL(60, 4),
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL(60, 4),
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM("pending", "failed", "successful", "canceled"),
        allowNull: true,
        defaultValue: "pending",
      },
      deliveryStatus: {
        type: DataTypes.ENUM("pending", "failed", "delivered", "canceled"),
        allowNull: true,
        defaultValue: "pending",
      },
      tx_ref: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: "tx_ref_3",
      },
      transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "_id",
        },
      },
      userName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      userEmail: {
        type: DataTypes.STRING(30),
        allowNull: true,
        unique: "userEmail_2",
      },
      userPhone: {
        type: DataTypes.STRING(30),
        allowNull: true,
        unique: "userPhone_2",
      },
    },
    {
      sequelize,
      tableName: "orders",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "_id" }],
        },
        {
          name: "tx_ref",
          unique: true,
          using: "BTREE",
          fields: [{ name: "tx_ref" }],
        },
        {
          name: "tx_ref_2",
          unique: true,
          using: "BTREE",
          fields: [{ name: "tx_ref" }],
        },
        {
          name: "userEmail",
          unique: true,
          using: "BTREE",
          fields: [{ name: "userEmail" }],
        },
        {
          name: "userPhone",
          unique: true,
          using: "BTREE",
          fields: [{ name: "userPhone" }],
        },
        {
          name: "tx_ref_3",
          unique: true,
          using: "BTREE",
          fields: [{ name: "tx_ref" }],
        },
        {
          name: "userEmail_2",
          unique: true,
          using: "BTREE",
          fields: [{ name: "userEmail" }],
        },
        {
          name: "userPhone_2",
          unique: true,
          using: "BTREE",
          fields: [{ name: "userPhone" }],
        },
        {
          name: "user",
          using: "BTREE",
          fields: [{ name: "userId" }],
        },
      ],
    }
  );
  orders.associate = function (models) {
    orders.hasOne(models.deliveryaddress, { foreignKey: "orderId" });
    orders.belongsTo(models.users);
  };

  return orders;
};
