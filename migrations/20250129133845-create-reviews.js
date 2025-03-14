'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rating: {
        type: Sequelize.INTEGER, 
        allowNull : false 
      },
      comment: {
        type: Sequelize.TEXT , 
        allowNull : false 

      },
      userId: {
        type: Sequelize.INTEGER , 
        allowNull : false 
      },
      productId: {
        type: Sequelize.INTEGER, 
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
    await queryInterface.dropTable('Reviews');
  }
};