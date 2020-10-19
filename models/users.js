const {encryptPwd} = require('../helpers/bcrypt')
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.belongsToMany(models.Campaigns, {through: 'models.UserDonations'})
      Users.belongsToMany(models.Campaigns, {through: 'models.UserComments'})
      // define association here
    }
  };
  Users.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Please use a valid email address"
        },
        notEmpty: {
          msg: "Email cannot be empty"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^(?=[a-zA-Z0-9]*[a-zA-Z])(?=[a-zA-Z0-9]*\d)[a-zA-Z0-9]*$/i,
          msg: "Please enter alphanumeric password",
        },
        notEmpty: {
          msg: "Please enter a password"
        }
      }      
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Name must not be empty"
        }
      }
    },
    creditcard: {
      type: DataTypes.INTEGER,
      validate: {
        isCreditCard:{
          msg: "Please use a valid credit card number"
        }
      }
    },
    photo: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(Users){
        Users.image = "";
        Users.password = encryptPwd(Users.password);
      },
      beforeBulkUpdate(Users){
        if(Users.attributes.password == null){
        }else{
          Users.attributes.password = encryptPwd(Users.attributes.password);
        }
      }
    },
    sequelize,
    modelName: 'Users',
  });
  return Users;
};
