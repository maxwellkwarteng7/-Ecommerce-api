'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint('Reviews', {
      fields: ['userId', 'productId'],
      type: 'unique',
      name: 'unique_user_product_review' // Custom name for the constraint
    });

    await queryInterface.removeConstraint('Reviews', 'reviews_userId_fkey').catch(() => { });
    
    await queryInterface.changeColumn('Reviews', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     * 
     */
    await queryInterface.changeColumn('Reviews', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    
    await queryInterface.removeConstraint('Reviews', 'unique_user_product_review');
  }
};
