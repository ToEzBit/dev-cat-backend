"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderReview.belongsTo(models.Order, {
        foreignKey: {
          name: "orderId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });
    }
  }
  OrderReview.init(
    {
      status: {
        type: DataTypes.ENUM(["pass", "needRevision"]),
        allowNull: false,
      },
      countRevision: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reviewDetail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "OrderReview",
    }
  );
  return OrderReview;
};
