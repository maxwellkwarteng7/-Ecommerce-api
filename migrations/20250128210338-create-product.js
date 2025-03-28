'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING, 
        allowNull: false 
      },
      price: {
        type : Sequelize.FLOAT , 
        allowNull: false 
      },
      discountPrice: {
        type: Sequelize.FLOAT, 
        allowNull: true 
      }, 
      description: {
        type: Sequelize.TEXT, 
        allowNull: false 
      }, 
      stock: {
        type: Sequelize.INTEGER, 
        allowNull : false 
      } , 
      image: {
        type: Sequelize.STRING, 
        allowNull : false 
      }, 
      categoryId: {
        type: Sequelize.INTEGER, 
        allowNull : false 
      }, 
      tagId: {
        type: Sequelize.INTEGER, 
        allowNull: true 
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
    await queryInterface.dropTable('Products');
  }
};