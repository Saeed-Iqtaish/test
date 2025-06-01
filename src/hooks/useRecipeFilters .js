// src/hooks/useRecipeFilters.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const useRecipeFilters = () => {
  const { user, isAuthenticated } = useAuth();

  // Initialize filters with user allergies if logged in
  const getInitialFilters = useCallback(() => ({
    search: "",
    diet: [],
    allergy: isAuthenticated && user?.allergies ? [...user.allergies] : [],
    mood: [],
  }), [isAuthenticated, user?.allergies]);

  const [filters, setFilters] = useState(getInitialFilters());
  const [appliedFilters, setAppliedFilters] = useState(getInitialFilters());

  // Update filters when user auth state changes
  useEffect(() => {
    const newFilters = getInitialFilters();
    setFilters(newFilters);
    setAppliedFilters(newFilters);
  }, [getInitialFilters]);

  // Debounce for live search
  useEffect(() => {
    const delay = setTimeout(() => {
      setAppliedFilters((prev) => ({
        ...prev,
        search: filters.search,
      }));
    }, 300);
    return () => clearTimeout(delay);
  }, [filters.search]);

  const updateFilter = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedFilters({ ...filters });
  }, [filters]);

  const clearFilters = useCallback(() => {
    // When clearing, keep user allergies but clear everything else
    const clearedFilters = {
      search: "",
      diet: [],
      allergy: isAuthenticated && user?.allergies ? [...user.allergies] : [],
      mood: []
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
  }, [isAuthenticated, user?.allergies]);

  // Calculate active filter count for display
  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (filters.mood.length > 0) count += filters.mood.length;
    if (filters.diet.length > 0) count += filters.diet.length;
    if (filters.allergy.length > 0) count += filters.allergy.length;
    return count;
  }, [filters]);

  return {
    filters,
    appliedFilters,
    updateFilter,
    applyFilters,
    clearFilters,
    getActiveFilterCount,
    userAllergies: user?.allergies || []
  };
};

export default useRecipeFilters;