'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reviews.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });

      Reviews.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
        as: 'user'
      });
    }
  }
  Reviews.init({
    rating: {
      type: DataTypes.INTEGER, 
      allowNull : false 
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull :false 
    },
    userId: {
      type: DataTypes.INTEGER, 
      allowNull : false 
    } , 
    productId: {
      type: DataTypes.INTEGER, 
      allowNull : false 
    }
  }, {
    sequelize,
    modelName: 'Reviews',
  });
  return Reviews;
};