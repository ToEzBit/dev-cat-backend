"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Devs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastChangePassword: {
        type: Sequelize.DATE,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      profileImage: {
        type: Sequelize.STRING,
      },
      profileImagePublicId: {
        type: Sequelize.STRING,
      },
      lastLogin: {
        type: Sequelize.DATE,
      },
      bankProvider: {
        type: Sequelize.STRING,
      },
      bankAccountNumber: {
        type: Sequelize.STRING,
      },
      forgetKey: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Devs");
  },
};
