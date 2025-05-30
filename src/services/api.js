import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (getAccessTokenSilently) => {
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await getAccessTokenSilently();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error getting access token:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export const userAPI = {
  createProfile: () => api.post('/users/profile'),
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
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