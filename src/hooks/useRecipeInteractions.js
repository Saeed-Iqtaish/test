// src/hooks/useRecipeInteractions.js
import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const useRecipeInteractions = ({ openRecipeDetails, openAuthModal }) => {
  const { isAuthenticated } = useAuth();

  const handleRecipeClick = useCallback((recipe) => {
    openRecipeDetails(recipe);
  }, [openRecipeDetails]);

  const handleFavoriteChange = useCallback((recipeId, isFavorited) => {
    console.log(`Recipe ${recipeId} favorite status changed: ${isFavorited}`);
    // Additional favorite change logic can be added here
  }, []);

  const handleLoginRequired = useCallback(() => {
    openAuthModal();
  }, [openAuthModal]);

  return {
    handleRecipeClick,
    handleFavoriteChange,
    handleLoginRequired,
    isAuthenticated
  };
};

export default useRecipeInteractions;