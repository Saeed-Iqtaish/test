import React, { useState, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import StarRating from './StarRating';
import { ratingsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function RecipeRating({ 
  recipeId, 
  isCommunityRecipe = true,
  size = 'md',
  showUserRating = true,
  className = '' 
}) {
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
      
      // If user is logged in, get their specific rating
      if (user && response.data.user_rating !== undefined) {
        setUserRating(response.data.user_rating || 0);
      }
      
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  const handleUserRatingChange = async (rating) => {
    if (!user) {
      setError('Please log in to rate recipes');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      await ratingsAPI.saveRating(recipeId, rating);
      setUserRating(rating);
      setSuccess('Rating saved successfully!');
      
      // Refresh the overall ratings
      setTimeout(() => {
        fetchRatings();
        setSuccess('');
      }, 1000);
      
    } catch (err) {
      console.error('Error saving rating:', err);
      setError(err.response?.data?.error || 'Failed to save rating');
    } finally {
      setSubmitting(false);
    }
  };

  // Don't show rating for non-community recipes
  if (!isCommunityRecipe) {
    return null;
  }

  if (loading) {
    return (
      <div className={`d-flex align-items-center ${className}`}>
        <Spinner size="sm" className="me-2" />
        <span className="text-muted">Loading ratings...</span>
      </div>
    );
  }

  return (
    <div className={`recipe-rating ${className}`}>
      {error && (
        <Alert variant="danger" className="py-2 px-3 mb-2 small">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="py-2 px-3 mb-2 small">
          {success}
        </Alert>
      )}

      {/* Overall Rating Display */}
      <div className="mb-3">
        <div className="d-flex align-items-center gap-2 mb-1">
          <StarRating
            value={averageRating}
            readonly={true}
            size={size}
            showCount={true}
            totalRatings={totalRatings}
          />
        </div>
        {totalRatings === 0 && (
          <small className="text-muted">No ratings yet</small>
        )}
      </div>

      {/* User Rating Section */}
      {showUserRating && user && (
        <div className="user-rating-section">
          <div className="mb-2">
            <label className="form-label small fw-semibold mb-1">
              Your Rating:
            </label>
          </div>
          <div className="d-flex align-items-center gap-2">
            <StarRating
              value={userRating}
              onChange={handleUserRatingChange}
              readonly={submitting}
              size={size}
            />
            {submitting && (
              <Spinner size="sm" className="ms-2" />
            )}
            {userRating > 0 && (
              <button
                className="btn btn-link btn-sm p-0 text-decoration-none"
                onClick={() => handleUserRatingChange(0)}
                disabled={submitting}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Login Prompt */}
      {showUserRating && !user && (
        <div className="mt-2">
          <small className="text-muted">
            <a href="/login" className="text-decoration-none">
              Log in
            </a> to rate this recipe
          </small>
        </div>
      )}
    </div>
  );
}

export default RecipeRating;