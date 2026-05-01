import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRecipe } from '../services/api';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const categoryOptions = [
  'desserts', 'breakfast', 'lunch', 'healthy', 'fast food', 'italian', 'chinese', 'other',
];

export default function AddRecipe() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', image: '', category: 'other',
    secretTip: '', servings: 4, prepTime: '', cookTime: '',
  });
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!user) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = (i) => setIngredients(ingredients.filter((_, idx) => idx !== i));
  const updateIngredient = (i, v) => {
    const updated = [...ingredients];
    updated[i] = v;
    setIngredients(updated);
  };

  const addInstruction = () => setInstructions([...instructions, '']);
  const removeInstruction = (i) => setInstructions(instructions.filter((_, idx) => idx !== i));
  const updateInstruction = (i, v) => {
    const updated = [...instructions];
    updated[i] = v;
    setInstructions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validIngredients = ingredients.filter((i) => i.trim());
    const validInstructions = instructions.filter((i) => i.trim());

    if (validIngredients.length === 0) return setError('Add at least one ingredient');
    if (validInstructions.length === 0) return setError('Add at least one instruction');

    setLoading(true);
    try {
      const res = await createRecipe({
        ...form,
        servings: parseInt(form.servings),
        ingredients: validIngredients,
        instructions: validInstructions,
      });
      navigate(`/recipe/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-form-page">
      <div className="recipe-form-card" id="add-recipe-form">
        <h1>📝 Add New Recipe</h1>
        <p className="form-subtitle">Share your family's best-kept culinary secrets</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Recipe Title *</label>
              <input type="text" id="title" name="title" value={form.title} onChange={handleChange} placeholder="e.g., Grandma's Apple Pie" required />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Tell us the story behind this recipe..." rows={3} required />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input type="text" id="image" name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/photo.jpg" />
          </div>

          <div className="form-row-three">
            <div className="form-group">
              <label htmlFor="prepTime">Prep Time</label>
              <input type="text" id="prepTime" name="prepTime" value={form.prepTime} onChange={handleChange} placeholder="e.g., 20 min" />
            </div>
            <div className="form-group">
              <label htmlFor="cookTime">Cook Time</label>
              <input type="text" id="cookTime" name="cookTime" value={form.cookTime} onChange={handleChange} placeholder="e.g., 45 min" />
            </div>
            <div className="form-group">
              <label htmlFor="servings">Servings</label>
              <input type="number" id="servings" name="servings" value={form.servings} onChange={handleChange} min={1} />
            </div>
          </div>

          {/* Ingredients */}
          <div className="form-group">
            <label>Ingredients *</label>
            {ingredients.map((ing, i) => (
              <div key={i} className="dynamic-input-row">
                <input
                  type="text"
                  value={ing}
                  onChange={(e) => updateIngredient(i, e.target.value)}
                  placeholder={`Ingredient ${i + 1}`}
                />
                {ingredients.length > 1 && (
                  <button type="button" className="btn-remove-input" onClick={() => removeIngredient(i)}>
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn-add-input" onClick={addIngredient}>
              <FiPlus /> Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div className="form-group">
            <label>Instructions *</label>
            {instructions.map((inst, i) => (
              <div key={i} className="dynamic-input-row">
                <span className="step-label">Step {i + 1}</span>
                <textarea
                  value={inst}
                  onChange={(e) => updateInstruction(i, e.target.value)}
                  placeholder={`Describe step ${i + 1}...`}
                  rows={2}
                />
                {instructions.length > 1 && (
                  <button type="button" className="btn-remove-input" onClick={() => removeInstruction(i)}>
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn-add-input" onClick={addInstruction}>
              <FiPlus /> Add Step
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="secretTip">🤫 Granny's Secret Tip (optional)</label>
            <textarea id="secretTip" name="secretTip" value={form.secretTip} onChange={handleChange} placeholder="That special trick only grandma knows..." rows={2} />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading} id="submit-recipe-button">
            {loading ? 'Publishing...' : '🍳 Publish Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
}
