// src/hooks/useRating.js
import { useState, useEffect } from 'react';
import { ratingsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useRating = (recipeId, isCommunityRecipe = true) => {
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    if (recipeId && isCommunityRecipe) {
      fetchRatings();
    }
  }, [recipeId, isCommunityRecipe]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await ratingsAPI.getRating(recipeId);
      setAverageRating(response.data.average_rating || 0);
      setTotalRatings(response.data.total_ratings || 0);
      setUserRating(response.data.user_rating || 0);
      
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (rating) => {
    if (!user) {
      setError('Please log in to rate recipes');
      return false;
    }

    try {
      setSubmitting(true);
      setError('');
      
      await ratingsAPI.saveRating(recipeId, rating);
      setUserRating(rating);
      
      await fetchRatings();
      return true;
      
    } catch (err) {
      console.error('Error saving rating:', err);
      setError(err.response?.data?.error || 'Failed to save rating');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const clearRating = () => submitRating(0);

  return {
    averageRating,
    totalRatings,
    userRating,
    loading,
    submitting,
    error,
    submitRating,
    clearRating,
    refreshRatings: fetchRatings,
    canRate: !!user && isCommunityRecipe
  };
};

export default useRating;