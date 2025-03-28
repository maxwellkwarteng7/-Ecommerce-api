'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderItems.belongsTo(models.Orders, {
        foreignKey: 'orderId',
        onDelete: 'CASCADE'
      });

      OrderItems.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
        as: 'product'
      })
    }
  }
  OrderItems.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orderStatus: {
      type: DataTypes.ENUM('Processing' , 'Shipped' , 'Delivered'),
      allowNull: false, 
      defaultValue : 'Processing'
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OrderItems',
  });
  return OrderItems;
};