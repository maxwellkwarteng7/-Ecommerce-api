'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CartItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER, 
        allowNull : false 
      }, 
      productId: {
        type: Sequelize.INTEGER, 
        allowNull : false 
      }, 
      cartId: {
        type: Sequelize.INTEGER, 
        allowNull : false 
      }, 
      subTotal: {
        type: Sequelize.FLOAT, 
        allowNull : false 
      } , 
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CartItems');
  }
};