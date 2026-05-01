const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Save = sequelize.define('Save', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Save;
