'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
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
      orderId: {
        type: Sequelize.INTEGER, 
        allowNull : false 
      }, 
      orderStatus: {
        type: Sequelize.ENUM('Processing' , 'Shipped' , 'Delivered'),
        allowNull: false, 
        defaultValue : 'Processing'
      },
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
    await queryInterface.dropTable('OrderItems');
  }
};