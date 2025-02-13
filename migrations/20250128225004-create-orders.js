'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      } , 
      totalPrice: {
        type: Sequelize.FLOAT, 
        allowNull : false 
      } , 
      userId: {
        type: Sequelize.INTEGER, 
        allowNull :false 
      },
      paymentStatus : {
        type: Sequelize.STRING, 
        allowNull: false 
      }, 
      paymentMethod: {
        type: Sequelize.STRING, 
        allowNull: false
      }, 
      transactionRef: {
        type: Sequelize.STRING, 
        allowNull: false
      }, 
      paymentDate: {
        type : Sequelize.DATE, 
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
    await queryInterface.dropTable('Orders');
  }
};