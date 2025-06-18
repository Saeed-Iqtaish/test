import { useState, useCallback } from 'react';
import { communityAPI } from '../services/api';
import { useMoodAssignment } from './useMoodAssignment';

export const useAdminRecipes = () => {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { assignMood } = useMoodAssignment();

  const fetchPendingRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await communityAPI.getPendingRecipes();
      
      const recipesWithMood = response.data.map(recipe => ({
        ...recipe,
        mood: assignMood(recipe)
      }));
      
      setPendingRecipes(recipesWithMood);
    } catch (error) {
      console.error("Error fetching pending recipes:", error);
      setError("Failed to load pending recipes");
    } finally {
      setLoading(false);
    }
  }, [assignMood]);

  return {
    pendingRecipes,
    loading,
    error,
    fetchPendingRecipes,
    refetch: fetchPendingRecipes
  };
};