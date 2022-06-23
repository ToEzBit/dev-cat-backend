"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProofPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProofPayment.belongsTo(models.Order, {
        foreignKey: {
          name: "orderId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });
    }
  }
  ProofPayment.init(
    {
      spacialRequire: DataTypes.BOOLEAN,
      transactionId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProofPayment",
    }
  );
  return ProofPayment;
};
