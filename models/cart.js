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
        foreignKey: 'userId', 
        as: 'user', 
        onDelete : 'CASCADE'
      })
    }
  }
  Cart.init({
    product_name: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    product_price: {
      type: DataTypes.INTEGER, 
      allowNull :false 
    },
    product_quantity: DataTypes.INTEGER,
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
    modelName: 'Cart',
  });
  return Cart;
};