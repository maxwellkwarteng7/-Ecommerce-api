'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CartItems.belongsTo(models.Cart, {
        foreignKey: 'cartId',
        onDelete: 'CASCADE',
      });

      CartItems.belongsTo(models.Product, {
        foreignKey: 'productId',
        as : 'products'
      })
    }
  }
  CartItems.init({
    quantity: {
      type: DataTypes.INTEGER, 
      allowNull : false 
    }, 
    productId: {
      type: DataTypes.INTEGER, 
      allowNull : false 
    }, 
    cartId: {
      type: DataTypes.INTEGER, 
      allowNull : false 
    }, 
    subTotal: {
      type: DataTypes.FLOAT, 
      allowNull : false 
    }
  }, {
    sequelize,
    modelName: 'CartItems',
  });
  return CartItems;
};