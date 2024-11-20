'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class oneTimePin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      oneTimePin.belongsTo(models.User, {
        as: 'UserPin',
        foreignKey: 'userId', 
        onDelete : 'CASCADE'
      });
    }
  }
  oneTimePin.init({
    pin: DataTypes.INTEGER, 
    userId: {
      type: DataTypes.INTEGER, 
    },  
    expiresIn: {
      type : DataTypes.DATE  
    }
  }, {
    sequelize,
    modelName: 'oneTimePin',
  });
  return oneTimePin;
};