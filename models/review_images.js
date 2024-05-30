const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('review_images', {
    _id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'reviews',
        key: '_id'
      }
    },
    product: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'reviews',
        key: '_id'
      }
    },
    image0: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "https:\/\/res.cloudinary.com\/dod7yij4e\/image\/upload\/v1696329171\/Review%20Images\/tmp-1-1696329166987_mu2z3n.png"
    },
    image1: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "https:\/\/res.cloudinary.com\/dod7yij4e\/image\/upload\/v1696329171\/Review%20Images\/tmp-1-1696329166987_mu2z3n.png"
    },
    image2: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "https:\/\/res.cloudinary.com\/dod7yij4e\/image\/upload\/v1696329171\/Review%20Images\/tmp-1-1696329166987_mu2z3n.png"
    },
    image3: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "https:\/\/res.cloudinary.com\/dod7yij4e\/image\/upload\/v1696329171\/Review%20Images\/tmp-1-1696329166987_mu2z3n.png"
    }
  }, {
    sequelize,
    tableName: 'review_images',
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
        name: "review_imgs_id",
        using: "BTREE",
        fields: [
          { name: "user" },
        ]
      },
      {
        name: "product",
        using: "BTREE",
        fields: [
          { name: "product" },
        ]
      },
    ]
  });
};
