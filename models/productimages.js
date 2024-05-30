const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productimages', {
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
    image0: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    image1: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    image2: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    image3: {
      type: DataTypes.STRING(256),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'productimages',
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
        name: "productimages_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "product" },
        ]
      },
    ]
  });
};
