import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecipe, updateRecipe } from '../services/api';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const categoryOptions = [
  'desserts', 'breakfast', 'lunch', 'healthy', 'fast food', 'italian', 'chinese', 'other',
];

export default function EditRecipe() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', image: '', category: 'other',
    secretTip: '', servings: 4, prepTime: '', cookTime: '',
  });
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    fetchRecipe();
  }, [id, user, authLoading]);

  const fetchRecipe = async () => {
    try {
      const res = await getRecipe(id);
      const r = res.data;
      if (r.userId !== user.id) {
        navigate('/');
        return;
      }
      setForm({
        title: r.title, description: r.description, image: r.image || '',
        category: r.category, secretTip: r.secretTip || '',
        servings: r.servings || 4, prepTime: r.prepTime || '', cookTime: r.cookTime || '',
      });
      setIngredients(r.ingredients?.length ? r.ingredients : ['']);
      setInstructions(r.instructions?.length ? r.instructions : ['']);
    } catch (err) {
      setError('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = (i) => setIngredients(ingredients.filter((_, idx) => idx !== i));
  const updateIngredientVal = (i, v) => { const u = [...ingredients]; u[i] = v; setIngredients(u); };

  const addInstruction = () => setInstructions([...instructions, '']);
  const removeInstruction = (i) => setInstructions(instructions.filter((_, idx) => idx !== i));
  const updateInstructionVal = (i, v) => { const u = [...instructions]; u[i] = v; setInstructions(u); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validIngredients = ingredients.filter((i) => i.trim());
    const validInstructions = instructions.filter((i) => i.trim());
    if (validIngredients.length === 0) return setError('Add at least one ingredient');
    if (validInstructions.length === 0) return setError('Add at least one instruction');

    setSaving(true);
    try {
      await updateRecipe(id, {
        ...form,
        servings: parseInt(form.servings),
        ingredients: validIngredients,
        instructions: validInstructions,
      });
      navigate(`/recipe/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update recipe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="recipe-form-page">
      <div className="recipe-form-card" id="edit-recipe-form">
        <h1>✏️ Edit Recipe</h1>
        <p className="form-subtitle">Update your recipe's details</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-title">Recipe Title *</label>
              <input type="text" id="edit-title" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="edit-category">Category *</label>
              <select id="edit-category" name="category" value={form.category} onChange={handleChange}>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit-description">Description *</label>
            <textarea id="edit-description" name="description" value={form.description} onChange={handleChange} rows={3} required />
          </div>

          <div className="form-group">
            <label htmlFor="edit-image">Image URL</label>
            <input type="text" id="edit-image" name="image" value={form.image} onChange={handleChange} />
          </div>

          <div className="form-row-three">
            <div className="form-group">
              <label htmlFor="edit-prepTime">Prep Time</label>
              <input type="text" id="edit-prepTime" name="prepTime" value={form.prepTime} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="edit-cookTime">Cook Time</label>
              <input type="text" id="edit-cookTime" name="cookTime" value={form.cookTime} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="edit-servings">Servings</label>
              <input type="number" id="edit-servings" name="servings" value={form.servings} onChange={handleChange} min={1} />
            </div>
          </div>

          <div className="form-group">
            <label>Ingredients *</label>
            {ingredients.map((ing, i) => (
              <div key={i} className="dynamic-input-row">
                <input type="text" value={ing} onChange={(e) => updateIngredientVal(i, e.target.value)} placeholder={`Ingredient ${i + 1}`} />
                {ingredients.length > 1 && (
                  <button type="button" className="btn-remove-input" onClick={() => removeIngredient(i)}><FiTrash2 /></button>
                )}
              </div>
            ))}
            <button type="button" className="btn-add-input" onClick={addIngredient}><FiPlus /> Add Ingredient</button>
          </div>

          <div className="form-group">
            <label>Instructions *</label>
            {instructions.map((inst, i) => (
              <div key={i} className="dynamic-input-row">
                <span className="step-label">Step {i + 1}</span>
                <textarea value={inst} onChange={(e) => updateInstructionVal(i, e.target.value)} rows={2} />
                {instructions.length > 1 && (
                  <button type="button" className="btn-remove-input" onClick={() => removeInstruction(i)}><FiTrash2 /></button>
                )}
              </div>
            ))}
            <button type="button" className="btn-add-input" onClick={addInstruction}><FiPlus /> Add Step</button>
          </div>

          <div className="form-group">
            <label htmlFor="edit-secretTip">🤫 Granny's Secret Tip</label>
            <textarea id="edit-secretTip" name="secretTip" value={form.secretTip} onChange={handleChange} rows={2} />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={saving} id="update-recipe-button">
            {saving ? 'Updating...' : '✅ Update Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
}
