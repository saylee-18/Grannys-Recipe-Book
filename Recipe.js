const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recipe = sequelize.define('Recipe', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [3, 200] },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  ingredients: {
    type: DataTypes.TEXT, // stored as JSON string
    allowNull: false,
    get() {
      const val = this.getDataValue('ingredients');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('ingredients', JSON.stringify(val));
    },
  },
  instructions: {
    type: DataTypes.TEXT, // stored as JSON string
    allowNull: false,
    get() {
      const val = this.getDataValue('instructions');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('instructions', JSON.stringify(val));
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'other',
  },
  secretTip: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  servings: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
  },
  prepTime: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  cookTime: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // null for default/seed recipes
  },
});

module.exports = Recipe;
