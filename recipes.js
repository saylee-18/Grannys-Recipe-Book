const express = require('express');
const { Op } = require('sequelize');
const { Recipe, User, Like, Save, Comment } = require('../models');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Helper to attach like/save/comment counts + user status
async function enrichRecipe(recipe, userId) {
  const plain = recipe.toJSON ? recipe.toJSON() : { ...recipe };
  const likeCount = await Like.count({ where: { recipeId: plain.id } });
  const commentCount = await Comment.count({ where: { recipeId: plain.id } });
  const saveCount = await Save.count({ where: { recipeId: plain.id } });

  let isLiked = false;
  let isSaved = false;
  if (userId) {
    isLiked = !!(await Like.findOne({ where: { recipeId: plain.id, userId } }));
    isSaved = !!(await Save.findOne({ where: { recipeId: plain.id, userId } }));
  }

  return { ...plain, likeCount, commentCount, saveCount, isLiked, isSaved };
}

// GET /api/recipes — all recipes
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, category } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } },
      ];
    }
    if (category) {
      where.category = category;
    }

    const recipes = await Recipe.findAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']],
    });

    const enriched = await Promise.all(
      recipes.map((r) => enrichRecipe(r, req.userId))
    );

    res.json(enriched);
  } catch (err) {
    console.error('Get recipes error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/recipes/categories — list all distinct categories
router.get('/categories', async (req, res) => {
  try {
    const recipes = await Recipe.findAll({ attributes: ['category'], group: ['category'] });
    const categories = recipes.map((r) => r.category);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/recipes/user/mine — current user's recipes
router.get('/user/mine', auth, async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      where: { userId: req.userId },
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']],
    });
    const enriched = await Promise.all(recipes.map((r) => enrichRecipe(r, req.userId)));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/recipes/:id — single recipe
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
    });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    const enriched = await enrichRecipe(recipe, req.userId);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/recipes — create
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, image, ingredients, instructions, category, secretTip, servings, prepTime, cookTime } = req.body;

    if (!title || !description || !ingredients || !instructions || !category) {
      return res.status(400).json({ error: 'Title, description, ingredients, instructions, and category are required' });
    }

    const recipe = await Recipe.create({
      title,
      description,
      image: image || '',
      ingredients,
      instructions,
      category,
      secretTip: secretTip || '',
      servings: servings || 4,
      prepTime: prepTime || '',
      cookTime: cookTime || '',
      userId: req.userId,
    });

    const full = await Recipe.findByPk(recipe.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
    });

    res.status(201).json(await enrichRecipe(full, req.userId));
  } catch (err) {
    console.error('Create recipe error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/recipes/:id — update own recipe
router.put('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    if (recipe.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only edit your own recipes' });
    }

    const { title, description, image, ingredients, instructions, category, secretTip, servings, prepTime, cookTime } = req.body;

    await recipe.update({
      title: title || recipe.title,
      description: description || recipe.description,
      image: image !== undefined ? image : recipe.image,
      ingredients: ingredients || recipe.ingredients,
      instructions: instructions || recipe.instructions,
      category: category || recipe.category,
      secretTip: secretTip !== undefined ? secretTip : recipe.secretTip,
      servings: servings || recipe.servings,
      prepTime: prepTime !== undefined ? prepTime : recipe.prepTime,
      cookTime: cookTime !== undefined ? cookTime : recipe.cookTime,
    });

    const full = await Recipe.findByPk(recipe.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
    });

    res.json(await enrichRecipe(full, req.userId));
  } catch (err) {
    console.error('Update recipe error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/recipes/:id — delete own recipe
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    if (recipe.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own recipes' });
    }

    await Comment.destroy({ where: { recipeId: recipe.id } });
    await Like.destroy({ where: { recipeId: recipe.id } });
    await Save.destroy({ where: { recipeId: recipe.id } });
    await recipe.destroy();

    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
