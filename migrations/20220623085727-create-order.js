"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        },
      },
      devId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "Devs",
          },
          key: "id",
        },
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
      packageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "Packages",
          },
          key: "id",
        },
      },
      totalRevision: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currentRevision: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      packagePrice: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      totalSpacialRequirementPrice: {
        type: Sequelize.DECIMAL,
      },
      totalPrice: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
      },
      totalDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "pending",
          "inprogress",
          "awaitingReview",
          "needRevision",
          "completed",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      paymentStatus: {
        type: Sequelize.ENUM(
          "awaitingPayment",
          "paymentReceived",
          "awaitAdditionalPayment",
          "paidToDev"
        ),
        allowNull: false,
        defaultValue: "awaitingPayment",
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
    await queryInterface.dropTable("Orders");
  },
};
