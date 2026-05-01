const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { len: [1, 1000] },
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

module.exports = Comment;
