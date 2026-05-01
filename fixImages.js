// One-time script to fix any broken image URLs in the DB
const sequelize = require('./config/database');

const imageUpdates = [
  {
    title: 'Banana Bread with Walnuts',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80',
  },
];

async function fixImages() {
  try {
    for (const update of imageUpdates) {
      const [count] = await sequelize.query(
        `UPDATE Recipes SET image = '${update.image}' WHERE title = '${update.title}'`
      );
      console.log(`Updated "${update.title}": ${count} row(s) affected`);
    }
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await sequelize.close();
  }
}

fixImages();
