"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Packages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "Products",
          },
          key: "id",
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      info: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      revision: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      responsiveDesign: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      sourceFile: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      contentUpload: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      numberOfPages: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Packages");
  },
};
