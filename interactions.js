const express = require('express');
const { Comment, Like, Save, Recipe, User } = require('../models');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/interactions/:recipeId/like — toggle like
router.post('/:recipeId/like', auth, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    const existing = await Like.findOne({ where: { userId: req.userId, recipeId } });
    if (existing) {
      await existing.destroy();
      const likeCount = await Like.count({ where: { recipeId } });
      return res.json({ liked: false, likeCount });
    }

    await Like.create({ userId: req.userId, recipeId });
    const likeCount = await Like.count({ where: { recipeId } });
    res.json({ liked: true, likeCount });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/interactions/:recipeId/save — toggle save/bookmark
router.post('/:recipeId/save', auth, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    const existing = await Save.findOne({ where: { userId: req.userId, recipeId } });
    if (existing) {
      await existing.destroy();
      return res.json({ saved: false });
    }

    await Save.create({ userId: req.userId, recipeId });
    res.json({ saved: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/interactions/saved — get saved recipes for current user
router.get('/saved', auth, async (req, res) => {
  try {
    const saves = await Save.findAll({ where: { userId: req.userId } });
    const recipeIds = saves.map((s) => s.recipeId);

    const recipes = await Recipe.findAll({
      where: { id: recipeIds },
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']],
    });

    // Enrich with counts
    const enriched = await Promise.all(
      recipes.map(async (recipe) => {
        const plain = recipe.toJSON();
        const likeCount = await Like.count({ where: { recipeId: plain.id } });
        const commentCount = await Comment.count({ where: { recipeId: plain.id } });
        const isLiked = !!(await Like.findOne({ where: { recipeId: plain.id, userId: req.userId } }));
        return { ...plain, likeCount, commentCount, isLiked, isSaved: true };
      })
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/interactions/:recipeId/comments — get comments for recipe
router.get('/:recipeId/comments', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { recipeId: req.params.recipeId },
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/interactions/:recipeId/comments — add comment
router.post('/:recipeId/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const recipe = await Recipe.findByPk(req.params.recipeId);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    const comment = await Comment.create({
      text: text.trim(),
      userId: req.userId,
      recipeId: req.params.recipeId,
    });

    const full = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }],
    });

    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/interactions/comments/:id — delete own comment
router.delete('/comments/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.userId !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
