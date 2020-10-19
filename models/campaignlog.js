'use strict';
const sequelizePaginate = require('sequelize-paginate')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CampaignLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CampaignLog.belongsTo(models.Status)
      CampaignLog.belongsTo(models.Users)
      CampaignLog.belongsTo(models.Campaigns)
    }
  };
  CampaignLog.init({
    UserId: DataTypes.INTEGER,
    CampaignId: DataTypes.INTEGER,
    StatusId: DataTypes.INTEGER,
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
    date: DataTypes.DATE,
    ammount : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CampaignLog',
  });
  sequelizePaginate.paginate(CampaignLog)
  return CampaignLog;
};