import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSavedRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';

export default function SavedRecipes() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    fetchSaved();
  }, [user, authLoading]);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await getSavedRecipes();
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔖 Saved Recipes</h1>
        <p>Your collection of bookmarked recipes</p>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          <span className="empty-emoji">📌</span>
          <h3>No saved recipes yet</h3>
          <p>Browse recipes and click the bookmark icon to save them here!</p>
          <Link to="/" className="btn-primary">Browse Recipes</Link>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onUpdate={fetchSaved} />
          ))}
        </div>
      )}
    </div>
  );
}
