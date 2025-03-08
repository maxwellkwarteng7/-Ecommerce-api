'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      }); 
      Cart.hasMany(models.CartItems, {
        foreignKey: 'cartId',
        as: 'cartItems'
      }); 
      Cart.hasOne(models.Address, {
        foreignKey: 'cartId', 
        as : 'cart_shipping_address'
      })
    }
  }
  Cart.init({
    userId: {
      type: DataTypes.INTEGER, 
      allowNull : false 
    }, 
    totalPrice: {
      type: DataTypes.FLOAT,  
      allowNull : false 
    }
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};