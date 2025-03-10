'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Address.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      }); 

      Address.belongsTo(models.Cart, {
        foreignKey: 'cartId',
        onDelete: 'CASCADE'
      }); 

      Address.belongsTo(models.Orders, {
        foreignKey: 'addressId',
        as : 'order'
      }); 

     
  
    }
  }
  Address.init({
    fullName: {
      allowNull: false, 
      type : DataTypes.STRING
    },
    phone: {
      allowNull: false, 
      type : DataTypes.STRING
    },
    address1: {
      type: DataTypes.TEXT, 
      allowNull : false 
    },
    address2: {
      allowNull: true, 
      type : DataTypes.TEXT
    },
    country: {
      type: DataTypes.STRING, 
      allowNull : false 
    },
    city: {
      allowNull: false, 
      type : DataTypes.STRING
    },
    userId: {
      type: DataTypes.INTEGER, 
      allowNull : false 
    }, 
    cartId: {
      type: DataTypes.INTEGER, 
      allowNull : false 
    }, 
    state:{
      allowNull: false, 
      type : DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Address',
  });
  return Address;
};