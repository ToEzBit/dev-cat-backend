"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Conversation.hasMany(models.Chat, {
        foreignKey: {
          name: "conversationId",
          allowNull: false,
        },
      });
    }
  }
  Conversation.init(
    {
      senderId: DataTypes.STRING,
      receiverId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Conversation",
    }
  );
  return Conversation;
};
