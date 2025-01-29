'use strict';
const bcrypt = require('bcrypt'); 
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.oneTimePin, {
        as: 'forgotPasswordPin',
        foreignKey: 'userId',
      }); 

      User.hasOne(models.Cart, {
        foreignKey: 'userId',
        as: 'cart'
      }); 
      User.hasOne(models.Orders, {
        as: 'orders', 
        foreignKey : 'userId'
      }) 
      User.hasOne(models.Reviews, {
        foreignKey: 'userId',
        as: 'user_Review'
      }); 
      User.hasMany(models.Address, {
        foreignKey: 'userId', 
        as : 'Shipping_address'
      })
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true, 
    },
    password: DataTypes.STRING,
    username: {
      type: DataTypes.STRING, 
    }, 
    emailverification : {
      type: DataTypes.DATE, 
      allowNull : true  
    } , 
    role: {
      type: DataTypes.ENUM('admin' , 'customer' , 'superAdmin') , 
      defaultValue : 'customer'
    }
  },{
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10); 
        user.password = await bcrypt.hash(user.password,salt); 
      }, 
      beforeUpdate: async(user) => {
        const salt = await bcrypt.genSalt(10); 
        user.password = await bcrypt.hash(user.password,salt);
      }
    }
  });

  User.prototype.validatePassword = async (rawpassword, hashedPassword) => {
    const isPasswordMatch = await bcrypt.compare(rawpassword, hashedPassword); 
    return isPasswordMatch;
  }


  return User;
};