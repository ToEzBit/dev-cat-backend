"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductReview.belongsTo(models.Dev, {
        foreignKey: {
          name: "devId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      ProductReview.belongsTo(models.Product, {
        foreignKey: {
          name: "productId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      ProductReview.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });
    }
  }
  ProductReview.init(
    {
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAnonymous: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rate: {
        type: DataTypes.ENUM(["1", "2", "3", "4", "5"]),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProductReview",
    }
  );
  return ProductReview;
};
