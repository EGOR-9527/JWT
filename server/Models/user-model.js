// server/Models/user-model.js
const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const UserBase = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true, 
    defaultValue: null 
  }

});

module.exports = { UserBase };
