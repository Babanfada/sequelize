const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('promotion', {
    _id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    promName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    details: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    images: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "https:\/\/res.cloudinary.com\/dod7yij4e\/image\/upload\/v1696329171\/Review%20Images\/tmp-1-1696329166987_mu2z3n.png"
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: '_id'
      }
    }
  }, {
    sequelize,
    tableName: 'promotion',
    hasTrigger: true,
    timestamps: true,
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
        name: "user",
        using: "BTREE",
        fields: [
          { name: "user" },
        ]
      },
    ]
  });
};
