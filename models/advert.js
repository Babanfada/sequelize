const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('advert', {
    adverttitle: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    advertdetails: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    advertlink: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "this cannot be empty"
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: '_id'
      }
    },
    _id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'advert',
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
