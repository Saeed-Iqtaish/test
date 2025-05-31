import React, { useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import { FiHeart } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext"; // Fixed import
import { favoritesAPI } from "../../services/api";

function FavoriteButton({ recipeId, onFavoriteChange }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const checkIfFavorited = useCallback(async () => {
    try {
      const response = await favoritesAPI.getFavorites();
      const isFav = response.data.some(fav => fav.recipe_id === recipeId);
      setIsFavorited(isFav);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  }, [recipeId]);

  useEffect(() => {
    if (isAuthenticated) {
      checkIfFavorited();
    }
  }, [recipeId, isAuthenticated, checkIfFavorited]);

  async function handleToggleFavorite() {
    if (!isAuthenticated) {
      alert("Please log in to save favorites");
      return;
    }

    setLoading(true);

    try {
      if (isFavorited) {
        await favoritesAPI.removeFavorite(recipeId);
        setIsFavorited(false);
        onFavoriteChange?.(recipeId, false);
      } else {
        await favoritesAPI.addFavorite(recipeId);
        setIsFavorited(true);
        onFavoriteChange?.(recipeId, true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorite. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return null; // Don't show favorite button if not logged in
  }

  return (
    <Button
      variant="link"
      className="p-0 border-0 favorite-btn"
      onClick={handleToggleFavorite}
      disabled={loading}
    >
      <FiHeart 
        size={20} 
        className={`heart-icon ${isFavorited ? 'favorited' : ''}`} 
      />
    </Button>
  );
}

export default FavoriteButton;