'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Orders.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        as: 'user'
      }); 

      Orders.hasMany(models.OrderItems, {
        foreignKey: 'orderId',
        as: 'orderItems'
      }); 
    }
  }
  Orders.init({
    userId: {
      type: DataTypes.INTEGER, 
      allowNull :false 
    }, 
    totalPrice: {
      type: DataTypes.FLOAT, 
      allowNull : false 
    }
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};