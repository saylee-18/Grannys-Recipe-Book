const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { User, Recipe, Comment, Like, Save } = require('./models');
const seedDefaultRecipes = require('./seeders/defaultRecipes');

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const interactionRoutes = require('./routes/interactions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/interactions', interactionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: "Granny's kitchen is open! 🍪" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function start() {
  try {
    await sequelize.sync();
    console.log('📦 Database synced');

    await seedDefaultRecipes();

    app.listen(PORT, () => {
      console.log(`\n🍳 Granny's Recipe Book API running at http://localhost:${PORT}\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
