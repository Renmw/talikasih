'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Status.hasMany(models.CampaignLog)
    }
  };
  Status.init({
    name: {
      type : DataTypes.TEXT,
      validate : {
        notEmpty : {
          args : true,
          msg: "Comment content must be filled"
        },
        len: {
          args: [1,280],
          msg: "Min character 4 and max character 280"
        }
      }
    }
  },{
    sequelize,
    modelName: 'Status',
  });
  return Status;
};