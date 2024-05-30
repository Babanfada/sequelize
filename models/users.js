const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = function (sequelize, DataTypes) {
  const users = sequelize.define(
    "users",
    {
      _id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      fullname: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: "email",
      },
      password: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: true,
        defaultValue: "user",
      },
      address: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        defaultValue: "please update your address",
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: "phone",
      },
      gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: true,
        defaultValue: "female",
      },
      emailNotification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      blacklisted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      verificationString: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      verified: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      passwordToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      passwordExpirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
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
          name: "email",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
        {
          name: "phone",
          unique: true,
          using: "BTREE",
          fields: [{ name: "phone" }],
        },
      ],
    }
  );
  users.associate = function (models) {
    users.hasMany(models.reviews, { foreignKey: "userId" });
    users.hasMany(models.orders, { foreignKey: "userId" });
  };
  users.prototype.comparePassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
  };
  users.beforeSave(async (user, options) => {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });
  return users;
};
