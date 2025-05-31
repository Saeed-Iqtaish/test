import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optionally redirect to login or refresh the page
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => 
    axios.post(`${API_BASE_URL}/auth/login`, { email, password }),
  signup: (username, email, password) => 
    axios.post(`${API_BASE_URL}/auth/signup`, { username, email, password }),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  getAllUsers: () => api.get('/users'),
};

export const favoritesAPI = {
  getFavorites: () => api.get('/favorites'),
  addFavorite: (recipeId) => api.post('/favorites', { recipe_id: recipeId }),
  removeFavorite: (recipeId) => api.delete('/favorites', { data: { recipe_id: recipeId } }),
};

export const notesAPI = {
  getNotes: (recipeId) => api.get(`/notes/recipe/${recipeId}`),
  saveNote: (recipeId, note) => api.post('/notes', { recipe_id: recipeId, note }),
  deleteNote: (recipeId) => api.delete('/notes', { data: { recipe_id: recipeId } }),
};

export const ratingsAPI = {
  getRating: (recipeId) => api.get(`/ratings/recipe/${recipeId}`),
  saveRating: (recipeId, rating) => api.post('/ratings', { recipe_id: recipeId, rating }),
};

export const communityAPI = {
  getRecipes: () => axios.get(`${API_BASE_URL}/community`),
  getRecipe: (id) => axios.get(`${API_BASE_URL}/community/${id}`),
  getPendingRecipes: () => api.get('/community/admin/pending'),
  createRecipe: (formData) => api.post('/community', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateRecipe: (id, formData) => api.put(`/community/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateRecipeApproval: (id, approved) => api.patch(`/community/${id}/approval`, { approved }),
};

export default api;