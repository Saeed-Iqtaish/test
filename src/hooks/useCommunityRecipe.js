import { useState, useEffect, useCallback } from 'react';

const useCommunityRecipe = (id) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Keep assignMood as fallback for recipes without mood in DB
  const assignMood = useCallback((recipe) => {
    const text = `${recipe.title} ${recipe.summary || ""}`.toLowerCase();

    if (text.includes("soup") || text.includes("creamy") || text.includes("bake")) {
      return "Cozy";
    }
    if (text.includes("avocado") || text.includes("smooth")) {
      return "Relaxed";
    }
    if (text.includes("spicy") || text.includes("noodle") || text.includes("chili")) {
      return "Energetic";
    }

    return "Happy";
  }, []);

  const fetchCommunityRecipe = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching community recipe for ID:', id);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/community/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Recipe not found');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }
      
      const data = await response.json();
      console.log('Community recipe data:', data);
      console.log('Recipe mood from DB:', data.mood);
      
      // For community recipes, use the mood from database
      const recipeWithMood = {
        ...data,
        // Use the mood from database if it exists, otherwise fallback to assignMood
        mood: data.mood || assignMood(data)
      };
      
      console.log('Final recipe mood:', recipeWithMood.mood);
      setRecipe(recipeWithMood);
    } catch (err) {
      console.error('Error fetching community recipe:', err);
      setError('Failed to load recipe details');
    } finally {
      setLoading(false);
    }
  }, [id, assignMood]);

  const refreshRecipe = useCallback(() => {
    fetchCommunityRecipe();
  }, [fetchCommunityRecipe]);

  useEffect(() => {
    fetchCommunityRecipe();
  }, [fetchCommunityRecipe]);

  return {
    recipe,
    loading,
    error,
    refreshRecipe
  };
};

export default useCommunityRecipe;