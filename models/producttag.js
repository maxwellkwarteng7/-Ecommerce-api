'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductTag.hasMany(models.Product, {
        foreignKey: "tagId",
        as: 'products'
      });
    }
  }
  ProductTag.init({
    name: {
      type: DataTypes.STRING, 
      allowNull : false 
    }
  }, {
    sequelize,
    modelName: 'ProductTag',
  });
  return ProductTag;
};