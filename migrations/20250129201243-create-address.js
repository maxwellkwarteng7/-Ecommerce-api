'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        allowNull: false, 
        type : Sequelize.STRING
      },
      phone: {
        allowNull: false, 
        type : Sequelize.STRING
      },
      address1: {
        type: Sequelize.TEXT, 
        allowNull : false 
      },
      userId: {
        type: Sequelize.INTEGER, 
        allowNull : false 
      },
      cartId: {
        type: Sequelize.INTEGER, 
        allowNull : false 
      }, 
      address2: {
        allowNull: true, 
        type : Sequelize.TEXT
      },
      country: {
        type: Sequelize.STRING, 
        allowNull : false 
      },
      city: {
        allowNull: false, 
        type : Sequelize.STRING
      },
      state:{
        allowNull: false, 
        type : Sequelize.STRING
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
    await queryInterface.dropTable('Addresses');
  }
};