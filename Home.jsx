import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { getRecipes } from '../services/api';
import { FiSearch } from 'react-icons/fi';

const categories = [
  { name: 'Desserts', slug: 'desserts', emoji: '🍰', color: '#e74c8c' },
  { name: 'Breakfast', slug: 'breakfast', emoji: '🥞', color: '#f39c12' },
  { name: 'Lunch', slug: 'lunch', emoji: '🍲', color: '#27ae60' },
  { name: 'Healthy', slug: 'healthy', emoji: '🥗', color: '#2ecc71' },
  { name: 'Fast Food', slug: 'fast food', emoji: '🍔', color: '#e74c3c' },
  { name: 'Italian', slug: 'italian', emoji: '🍝', color: '#d35400' },
  { name: 'Chinese', slug: 'chinese', emoji: '🥡', color: '#c0392b' },
];

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRecipes = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const res = await getRecipes(query ? { search: query } : {});
      setRecipes(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes(search);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Granny's <span className="text-accent">Recipe</span> Book
          </h1>
          <p className="hero-subtitle">
            Discover beloved family recipes passed down through generations.
            <br />Every dish tells a story. Every bite feels like home.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="search-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search recipes... (e.g., apple pie, pasta, chicken)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="search-input"
              />
              <button type="submit" className="btn-search" id="search-button">Search</button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section" id="categories-section">
        <h2 className="section-title">Browse by Category</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="category-card"
              style={{ '--cat-color': cat.color }}
            >
              <span className="category-emoji">{cat.emoji}</span>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* All Recipes */}
      <section className="recipes-section" id="recipes-section">
        <h2 className="section-title">
          {search ? `Results for "${search}"` : 'All Recipes'}
        </h2>
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Gathering Granny's recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-emoji">📖</span>
            <h3>No recipes found</h3>
            <p>Try a different search or browse by category!</p>
          </div>
        ) : (
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onUpdate={() => fetchRecipes(search)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
