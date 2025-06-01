import { useState, useEffect, useCallback } from 'react';
import { notesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const useRecipeNotes = (recipeId) => {
  const { isAuthenticated } = useAuth();
  const [userNote, setUserNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempNote, setTempNote] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUserNote = useCallback(async () => {
    if (!isAuthenticated || !recipeId) return;
    
    try {
      const response = await notesAPI.getNotes(recipeId);
      if (response.data.length > 0) {
        setUserNote(response.data[0].note);
      }
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  }, [recipeId, isAuthenticated]);

  const saveNote = useCallback(async (note) => {
    setLoading(true);
    try {
      await notesAPI.saveNote(recipeId, note);
      setUserNote(note);
      setIsEditing(false);
      setTempNote('');
      return { success: true };
    } catch (error) {
      console.error("Error saving note:", error);
      return { success: false, error: "Failed to save note" };
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  const startEditing = useCallback(() => {
    setTempNote(userNote);
    setIsEditing(true);
  }, [userNote]);

  const cancelEditing = useCallback(() => {
    setTempNote('');
    setIsEditing(false);
  }, []);

  useEffect(() => {
    fetchUserNote();
  }, [fetchUserNote]);

  return {
    userNote,
    isEditing,
    tempNote,
    loading,
    setTempNote,
    saveNote,
    startEditing,
    cancelEditing
  };
};

export default useRecipeNotes;