'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, {
        as: 'category',
        foreignKey: 'categoryId',
        onDelete: 'CASCADE'
      }); 
      Product.hasMany(models.CartItems, {
        foreignKey: 'productId',
        as: 'cart_Items'
      }); 

      Product.hasMany(models.OrderItems, {
        foreignKey: 'productId',
        as: 'order_Items'
      });
      
      Product.hasMany(models.Reviews, {
        foreignKey: 'productId',
        as: 'reviews'
      }); 

      Product.belongsTo(models.ProductTag, {
        foreignKey: 'tagId',
        as: 'tag',
        onDelete: 'CASCADE'
      });
    
      
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING, 
      allowNull: false 
    },
    price: {
      type : DataTypes.FLOAT , 
      allowNull: false 
    },
    discountPrice: {
      type: DataTypes.FLOAT, 
      allowNull: true 
    }, 
    description: {
      type: DataTypes.TEXT, 
      allowNull: false 
    }, 
    image: {
      type: DataTypes.STRING, 
      allowNull : false 
    }, 
    stock: {
      type: DataTypes.INTEGER, 
      allowNull : false 
    } , 
    categoryId: {
      type: DataTypes.INTEGER, 
      allowNull : false 
    },  
    tagId: {
      type: DataTypes.INTEGER, 
      allowNull: true 
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};