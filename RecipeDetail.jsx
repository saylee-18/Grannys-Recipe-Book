import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecipe, getComments, addComment, deleteComment, deleteRecipe, toggleLike, toggleSave } from '../services/api';
import { FiHeart, FiBookmark, FiShare2, FiEdit, FiTrash2, FiClock, FiUsers, FiSend } from 'react-icons/fi';
import { FaHeart, FaBookmark } from 'react-icons/fa';

export default function RecipeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [recipeRes, commentsRes] = await Promise.all([
        getRecipe(id),
        getComments(id),
      ]);
      setRecipe(recipeRes.data);
      setLiked(recipeRes.data.isLiked || false);
      setLikeCount(recipeRes.data.likeCount || 0);
      setSaved(recipeRes.data.isSaved || false);
      setComments(commentsRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLike = async () => {
    if (!user) return navigate('/login');
    try {
      const res = await toggleLike(id);
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    if (!user) return navigate('/login');
    try {
      const res = await toggleSave(id);
      setSaved(res.data.saved);
    } catch (err) { console.error(err); }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: recipe.title, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied!');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await addComment(id, newComment);
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) { console.error(err); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    try {
      await deleteRecipe(recipe.id);
      navigate('/');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete recipe.');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <span className="empty-emoji">⚠️</span>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button className="btn-primary" onClick={fetchData}>Try Again</button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="empty-state">
        <span className="empty-emoji">😔</span>
        <h3>Recipe not found</h3>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  const isOwner = user && recipe.userId === user.id;

  return (
    <div className="recipe-detail-page" id="recipe-detail">
      {/* Hero Image */}
      <div className="recipe-hero">
        <img
          src={recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&q=80'}
          alt={recipe.title}
        />
        <div className="recipe-hero-overlay">
          <div className="recipe-hero-content">
            <span className="recipe-category-badge">{recipe.category}</span>
            <h1>{recipe.title}</h1>
            <p className="recipe-hero-author">
              by {recipe.author?.username || 'Granny'} • {new Date(recipe.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="recipe-detail-container">
        {/* Action Bar */}
        <div className="recipe-actions-bar">
          <button className={`action-btn-lg ${liked ? 'liked' : ''}`} onClick={handleLike}>
            {liked ? <FaHeart /> : <FiHeart />} {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
          </button>
          <button className={`action-btn-lg ${saved ? 'saved' : ''}`} onClick={handleSave}>
            {saved ? <FaBookmark /> : <FiBookmark />} {saved ? 'Saved' : 'Save'}
          </button>
          <button className="action-btn-lg" onClick={handleShare}>
            <FiShare2 /> Share
          </button>
          {isOwner && (
            <>
              <Link to={`/edit-recipe/${recipe.id}`} className="action-btn-lg edit-btn">
                <FiEdit /> Edit
              </Link>
              <button className="action-btn-lg delete-btn" onClick={handleDelete} id="delete-recipe-btn">
                <FiTrash2 /> Delete
              </button>
            </>
          )}
        </div>

        {/* Description */}
        <div className="recipe-description-block">
          <p>{recipe.description}</p>
        </div>

        {/* Meta Info */}
        <div className="recipe-meta-grid">
          {recipe.prepTime && (
            <div className="meta-card">
              <FiClock className="meta-icon" />
              <span className="meta-label">Prep Time</span>
              <span className="meta-value">{recipe.prepTime}</span>
            </div>
          )}
          {recipe.cookTime && (
            <div className="meta-card">
              <FiClock className="meta-icon" />
              <span className="meta-label">Cook Time</span>
              <span className="meta-value">{recipe.cookTime}</span>
            </div>
          )}
          {recipe.servings && (
            <div className="meta-card">
              <FiUsers className="meta-icon" />
              <span className="meta-label">Servings</span>
              <span className="meta-value">{recipe.servings}</span>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="recipe-content-grid">
          {/* Ingredients */}
          <div className="recipe-section ingredients-section">
            <h2>🛒 Ingredients</h2>
            <ul className="ingredients-list">
              {(recipe.ingredients || []).map((ing, i) => (
                <li key={i} className="ingredient-item">
                  <span className="ingredient-check">○</span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="recipe-section instructions-section">
            <h2>👩‍🍳 Instructions</h2>
            <ol className="instructions-list">
              {(recipe.instructions || []).map((step, i) => (
                <li key={i} className="instruction-step">
                  <span className="step-number">{i + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Secret Tip */}
        {recipe.secretTip && (
          <div className="secret-tip-section">
            <button
              className="secret-tip-toggle"
              onClick={() => setShowTip(!showTip)}
              id="toggle-secret-tip"
            >
              {showTip ? '🔓' : '🤫'} Granny's Secret Tip
              <span className="tip-arrow">{showTip ? '▲' : '▼'}</span>
            </button>
            {showTip && (
              <div className="secret-tip-content">
                <p>💛 {recipe.secretTip}</p>
              </div>
            )}
          </div>
        )}

        {/* Comments Section */}
        <div className="comments-section" id="comments-section">
          <h2>💬 Comments ({comments.length})</h2>

          {user ? (
            <form className="comment-form" onSubmit={handleAddComment}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this recipe..."
                id="comment-input"
              />
              <button type="submit" className="btn-comment-submit" id="submit-comment">
                <FiSend />
              </button>
            </form>
          ) : (
            <p className="comment-login-prompt">
              <Link to="/login">Sign in</Link> to leave a comment
            </p>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item" id={`comment-${comment.id}`}>
                  <div className="comment-header">
                    <strong>{comment.user?.username || 'Anonymous'}</strong>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  {user && comment.userId === user.id && (
                    <button
                      className="btn-delete-comment"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
