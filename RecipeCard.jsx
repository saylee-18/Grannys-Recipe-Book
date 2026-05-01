import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiBookmark, FiMessageCircle, FiShare2, FiClock } from 'react-icons/fi';
import { FaHeart, FaBookmark } from 'react-icons/fa';
import { toggleLike, toggleSave } from '../services/api';

const categoryColors = {
  desserts: '#e74c8c',
  breakfast: '#f39c12',
  lunch: '#27ae60',
  healthy: '#2ecc71',
  'fast food': '#e74c3c',
  italian: '#d35400',
  chinese: '#c0392b',
  other: '#8e44ad',
};

export default function RecipeCard({ recipe, onUpdate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(recipe.isLiked || false);
  const [likeCount, setLikeCount] = useState(recipe.likeCount || 0);
  const [saved, setSaved] = useState(recipe.isSaved || false);
  const [animateLike, setAnimateLike] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate('/login');
    try {
      const res = await toggleLike(recipe.id);
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
      setAnimateLike(true);
      setTimeout(() => setAnimateLike(false), 400);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate('/login');
    try {
      const res = await toggleSave(recipe.id);
      setSaved(res.data.saved);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/recipe/${recipe.id}`;
    if (navigator.share) {
      navigator.share({ title: recipe.title, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Recipe link copied to clipboard!');
    }
  };

  const catColor = categoryColors[recipe.category?.toLowerCase()] || categoryColors.other;

  return (
    <Link to={`/recipe/${recipe.id}`} className="recipe-card" id={`recipe-card-${recipe.id}`}>
      <div className="recipe-card-image">
        <img
          src={recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80'}
          alt={recipe.title}
          loading="lazy"
        />
        <span className="recipe-card-category" style={{ backgroundColor: catColor }}>
          {recipe.category}
        </span>
        <button className={`recipe-card-save ${saved ? 'active' : ''}`} onClick={handleSave} aria-label="Save recipe">
          {saved ? <FaBookmark /> : <FiBookmark />}
        </button>
      </div>
      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <p className="recipe-card-desc">{recipe.description?.length > 100 ? recipe.description.substring(0, 100) + '...' : recipe.description}</p>
        {recipe.author && (
          <p className="recipe-card-author">
            by <strong>{recipe.author.username || 'Granny'}</strong>
          </p>
        )}
        <div className="recipe-card-meta">
          {recipe.prepTime && (
            <span className="meta-item">
              <FiClock /> {recipe.prepTime}
            </span>
          )}
          {recipe.servings && (
            <span className="meta-item">🍽 {recipe.servings} servings</span>
          )}
        </div>
        <div className="recipe-card-actions">
          <button
            className={`action-btn like-btn ${liked ? 'liked' : ''} ${animateLike ? 'animate' : ''}`}
            onClick={handleLike}
            aria-label="Like"
          >
            {liked ? <FaHeart /> : <FiHeart />}
            <span>{likeCount}</span>
          </button>
          <span className="action-btn comment-btn">
            <FiMessageCircle />
            <span>{recipe.commentCount || 0}</span>
          </span>
          <button className="action-btn share-btn" onClick={handleShare} aria-label="Share">
            <FiShare2 />
          </button>
        </div>
      </div>
    </Link>
  );
}
