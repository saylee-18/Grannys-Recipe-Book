import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';

const categoryMeta = {
  desserts: { emoji: '🍰', title: 'Desserts', desc: 'Sweet treats and baked delights' },
  breakfast: { emoji: '🥞', title: 'Breakfast', desc: 'Start your morning right' },
  lunch: { emoji: '🍲', title: 'Lunch', desc: 'Hearty midday meals' },
  healthy: { emoji: '🥗', title: 'Healthy', desc: 'Nutritious and delicious' },
  'fast food': { emoji: '🍔', title: 'Fast Food', desc: 'Quick and satisfying' },
  italian: { emoji: '🍝', title: 'Italian', desc: 'Authentic Italian favorites' },
  chinese: { emoji: '🥡', title: 'Chinese', desc: 'Traditional Chinese cuisine' },
};

export default function CategoryPage() {
  const { category } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const meta = categoryMeta[category] || { emoji: '🍽', title: category, desc: '' };

  useEffect(() => {
    fetchByCategory();
  }, [category]);

  const fetchByCategory = async () => {
    setLoading(true);
    try {
      const res = await getRecipes({ category });
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header category-header">
        <span className="category-page-emoji">{meta.emoji}</span>
        <h1>{meta.title}</h1>
        <p>{meta.desc}</p>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          <span className="empty-emoji">📖</span>
          <h3>No {meta.title.toLowerCase()} recipes yet</h3>
          <p>Be the first to add one!</p>
          <Link to="/add-recipe" className="btn-primary">Add Recipe</Link>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onUpdate={fetchByCategory} />
          ))}
        </div>
      )}
    </div>
  );
}
