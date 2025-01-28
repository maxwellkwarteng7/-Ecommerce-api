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
        as : 'user'
      })
    }
  }
  Orders.init({
    product_name: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    product_price: {
      type: DataTypes.INTEGER, 
      allowNull :false 
    },
    product_quantity:{
      type: DataTypes.INTEGER, 
      allowNull :false 
    },
    product_image: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    product_description: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    product_category: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    userId: {
      type: DataTypes.INTEGER, 
      allowNull :false 
    }
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};