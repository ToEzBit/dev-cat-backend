"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat.belongsTo(models.Conversation, {
        foreignKey: {
          name: "conversationId",
          allowNull: false,
        },
      });
    }
  }
  Chat.init(
    {
      sender: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
