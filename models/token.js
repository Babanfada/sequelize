const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "token",
    {
      refreshToken: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      ip: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      userAgent: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      isValid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      user: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "_id",
        },
      },
      _id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      tableName: "token",
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
};
