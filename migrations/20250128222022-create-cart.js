'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      product_price: {
        type: Sequelize.INTEGER, 
        allowNull :false 
      },
      product_quantity: {
        allowNull: false, 
        type : Sequelize.INTEGER
      },
      product_image: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      product_description: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      product_category: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      userId: {
        type: Sequelize.INTEGER, 
        allowNull :false 
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
    await queryInterface.dropTable('Carts');
  }
};