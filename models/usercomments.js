'use strict';
const sequelizePaginate = require('sequelize-paginate')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserComments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserComments.belongsTo(models.Users)
      UserComments.belongsTo(models.Campaigns)
    }
  };
  UserComments.init({
    UserId: DataTypes.INTEGER,
    CampaignId: DataTypes.INTEGER,
    content: {
      type : DataTypes.TEXT,
      validate:{
        notEmpty : {
          args : true,
          msg: "Comment content must be filled"
        },
        len: {
          args: [4,280],
          msg: "Min character 4 and max character 280"
        }
      }
    },
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserComments',
  });
  sequelizePaginate.paginate(UserComments)
  return UserComments;
};