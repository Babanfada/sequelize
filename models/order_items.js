const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_items', {
    _id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    product: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'products',
        key: '_id'
      }
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'orders',
        key: '_id'
      }
    }
  }, {
    sequelize,
    tableName: 'order_items',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "_id" },
        ]
      },
      {
        name: "product",
        using: "BTREE",
        fields: [
          { name: "product" },
        ]
      },
      {
        name: "order",
        using: "BTREE",
        fields: [
          { name: "order" },
        ]
      },
    ]
  });
};
