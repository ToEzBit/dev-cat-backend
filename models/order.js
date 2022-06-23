"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.SpecialRequirement, {
        foreignKey: {
          name: "orderId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      Order.hasMany(models.OrderReview, {
        foreignKey: {
          name: "orderId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      Order.hasMany(models.ProofPayment, {
        foreignKey: {
          name: "orderId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      Order.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      Order.belongsTo(models.Dev, {
        foreignKey: {
          name: "devId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      Order.belongsTo(models.Product, {
        foreignKey: {
          name: "productId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });

      Order.belongsTo(models.Package, {
        foreignKey: {
          name: "packageId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });
    }
  }
  Order.init(
    {
      totalRevision: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currentRevision: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalSpacialRequirementPrice: {
        type: DataTypes.INTEGER,
      },
      startDate: {
        type: DataTypes.DATE,
      },
      totalDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "inprogress",
          "awaitingReview",
          "completed",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      paymentStatus: {
        type: DataTypes.ENUM([
          "awaitingPayment",
          "paymentReceived",
          "awaitAdditionalPayment",
          "paidToDev",
        ]),
        allowNull: false,
        defaultValue: "awaitingPayment",
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
