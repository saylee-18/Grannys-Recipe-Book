const User = require('./User');
const Recipe = require('./Recipe');
const Comment = require('./Comment');
const Like = require('./Like');
const Save = require('./Save');

// User <-> Recipe
User.hasMany(Recipe, { foreignKey: 'userId', as: 'recipes' });
Recipe.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// User <-> Comment
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Recipe <-> Comment
Recipe.hasMany(Comment, { foreignKey: 'recipeId', as: 'comments' });
Comment.belongsTo(Recipe, { foreignKey: 'recipeId' });

// User <-> Like
User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId' });

// Recipe <-> Like
Recipe.hasMany(Like, { foreignKey: 'recipeId', as: 'likes' });
Like.belongsTo(Recipe, { foreignKey: 'recipeId' });

// User <-> Save
User.hasMany(Save, { foreignKey: 'userId' });
Save.belongsTo(User, { foreignKey: 'userId' });

// Recipe <-> Save
Recipe.hasMany(Save, { foreignKey: 'recipeId', as: 'saves' });
Save.belongsTo(Recipe, { foreignKey: 'recipeId' });

module.exports = { User, Recipe, Comment, Like, Save };
