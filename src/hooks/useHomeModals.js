// src/hooks/useHomeModals.js
import { useState, useCallback } from 'react';

const useHomeModals = () => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const openFilterModal = useCallback(() => setShowFilterModal(true), []);
  const closeFilterModal = useCallback(() => setShowFilterModal(false), []);

  const openAuthModal = useCallback(() => setShowAuthModal(true), []);
  const closeAuthModal = useCallback(() => setShowAuthModal(false), []);

  const openRecipeDetails = useCallback((recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeDetails(true);
  }, []);

  const closeRecipeDetails = useCallback(() => {
    setShowRecipeDetails(false);
    setSelectedRecipe(null);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  return {
    showFilterModal,
    showAuthModal,
    showRecipeDetails,
    selectedRecipe,

    openFilterModal,
    closeFilterModal,
    openAuthModal,
    closeAuthModal,
    openRecipeDetails,
    closeRecipeDetails,
    handleAuthSuccess
  };
};

export default useHomeModals;