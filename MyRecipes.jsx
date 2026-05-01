import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyRecipes, deleteRecipe } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { FiTrash2 } from 'react-icons/fi';

export default function MyRecipes() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    fetchMine();
  }, [user, authLoading]);

  const fetchMine = async () => {
    setLoading(true);
    try {
      const res = await getMyRecipes();
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    try {
      await deleteRecipe(id);
      setRecipes(recipes.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📖 My Recipes</h1>
        <p>Recipes you've created</p>
        <Link to="/add-recipe" className="btn-primary">+ Add New Recipe</Link>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          <span className="empty-emoji">👩‍🍳</span>
          <h3>No recipes yet</h3>
          <p>Share your first recipe with the world!</p>
          <Link to="/add-recipe" className="btn-primary">Add Recipe</Link>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="my-recipe-wrapper">
              <RecipeCard recipe={recipe} onUpdate={fetchMine} />
              <div className="my-recipe-actions">
                <Link to={`/edit-recipe/${recipe.id}`} className="btn-edit-sm">Edit</Link>
                <button className="btn-delete-sm" onClick={() => handleDelete(recipe.id)}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
