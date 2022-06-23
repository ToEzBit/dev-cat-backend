"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DevSkill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DevSkill.belongsTo(models.Dev, {
        foreignKey: {
          name: "devId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      });
    }
  }
  DevSkill.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM([
          "workExperience",
          "language",
          "programing",
          "certificate",
        ]),
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "DevSkill",
    }
  );
  return DevSkill;
};
