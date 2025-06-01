import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';

const useUserProfile = () => {
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    allergies: []
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Initialize form data when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        allergies: user.allergies || []
      });
    }
  }, [isAuthenticated, user]);

  // Fetch complete user profile
  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      const userData = response.data;
      
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        allergies: userData.allergies || []
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Handle input changes
  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  // Handle allergy changes
  const handleAllergyChange = useCallback((selectedAllergies) => {
    setFormData(prev => ({
      ...prev,
      allergies: selectedAllergies
    }));
  }, []);

  // Save profile changes
  const handleSave = useCallback(async () => {
    setUpdating(true);
    setError('');
    setMessage('');

    try {
      await userAPI.updateProfile(formData);
      setMessage('Profile updated successfully! Your allergy preferences will be applied automatically when browsing recipes.');
      setEditMode(false);
      
      // Refresh auth context to update user data everywhere
      await refreshProfile();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  }, [formData, refreshProfile]);

  // Cancel editing
  const handleCancel = useCallback(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        allergies: user.allergies || []
      });
    }
    setEditMode(false);
    setError('');
    setMessage('');
  }, [user]);

  // Enter edit mode
  const handleEditMode = useCallback(() => {
    setEditMode(true);
    setError('');
    setMessage('');
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessage('');
    setError('');
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    // State
    formData,
    editMode,
    loading,
    updating,
    message,
    error,
    
    // Actions
    handleInputChange,
    handleAllergyChange,
    handleSave,
    handleCancel,
    handleEditMode,
    clearMessages,
    fetchUserProfile
  };
};

// ✅ IMPORTANT: Make sure you have this default export
export default useUserProfile;