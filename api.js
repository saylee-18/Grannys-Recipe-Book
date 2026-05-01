import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Reload to reset React state (AuthContext will clear user)
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Recipes
export const getRecipes = (params) => api.get('/recipes', { params });
export const getRecipe = (id) => api.get(`/recipes/${id}`);
export const createRecipe = (data) => api.post('/recipes', data);
export const updateRecipe = (id, data) => api.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);
export const getCategories = () => api.get('/recipes/categories');
export const getMyRecipes = () => api.get('/recipes/user/mine');

// Interactions
export const toggleLike = (recipeId) => api.post(`/interactions/${recipeId}/like`);
export const toggleSave = (recipeId) => api.post(`/interactions/${recipeId}/save`);
export const getSavedRecipes = () => api.get('/interactions/saved');
export const getComments = (recipeId) => api.get(`/interactions/${recipeId}/comments`);
export const addComment = (recipeId, text) => api.post(`/interactions/${recipeId}/comments`, { text });
export const deleteComment = (commentId) => api.delete(`/interactions/comments/${commentId}`);

export default api;

