'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Campaigns)
    }
  };
  Category.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Category cannot be empty!"
        },
      }
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Image cannot be empty!"
        },
      }
    },
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};
