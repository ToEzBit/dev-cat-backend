"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Dev extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Dev.hasMany(models.DevSkill, {
        foreignKey: {
          name: "devId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      Dev.hasMany(models.Product, {
        foreignKey: {
          name: "devId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      Dev.hasMany(models.ProductReview, {
        foreignKey: {
          name: "devId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      Dev.hasMany(models.Order, {
        foreignKey: {
          name: "devId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      Dev.hasMany(models.Chat, {
        foreignKey: {
          name: "devId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });
    }
  }
  Dev.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastChangePassword: DataTypes.DATE,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      profileImage: DataTypes.STRING,
      profileImagePublicId: DataTypes.STRING,
      lastLogin: DataTypes.DATE,
      bankProvider: DataTypes.STRING,
      bankAccountNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Dev",
    }
  );
  return Dev;
};
