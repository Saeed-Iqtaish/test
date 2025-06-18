import React, { useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import { FiHeart } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { favoritesAPI } from "../../services/api";
import "../../styles/global/favorite_button.css";

function FavoriteButton({ 
  recipeId, 
  isCommunityRecipe = false,
  onFavoriteChange,
  onLoginRequired
}) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const checkIfFavorited = useCallback(async () => {
    if (!isAuthenticated) {
      setIsFavorited(false);
      return;
    }

    try {
      const response = await favoritesAPI.getFavorites();
      const isFav = response.data.some(fav => 
        fav.recipe_id === recipeId && fav.is_community === isCommunityRecipe
      );
      setIsFavorited(isFav);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  }, [recipeId, isCommunityRecipe, isAuthenticated]);

  useEffect(() => {
    checkIfFavorited();
  }, [recipeId, isCommunityRecipe, isAuthenticated, checkIfFavorited]);

  async function handleToggleFavorite() {
    if (!isAuthenticated) {
      if (onLoginRequired) {
        onLoginRequired();
      } else {
        alert("Please log in to save favorites");
      }
      return;
    }

    setLoading(true);

    try {
      if (isFavorited) {
        await favoritesAPI.removeFavorite(recipeId, isCommunityRecipe);
        setIsFavorited(false);
        onFavoriteChange?.(recipeId, false);
      } else {
        await favoritesAPI.addFavorite(recipeId, isCommunityRecipe);
        setIsFavorited(true);
        onFavoriteChange?.(recipeId, true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      
      if (error.response?.status === 401) {
        alert("Please log in again to save favorites");
      } else if (error.response?.status === 400 && error.response?.data?.error?.includes('foreign key')) {
        alert("Unable to save this recipe to favorites. Please try again later.");
      } else {
        alert("Failed to update favorite. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="link"
      className="p-0 border-0 favorite-btn"
      onClick={handleToggleFavorite}
      disabled={loading}
      title={!isAuthenticated ? "Log in to save favorites" : (isFavorited ? "Remove from favorites" : "Add to favorites")}
    >
      <FiHeart 
        size={20} 
        className={`heart-icon ${isFavorited ? 'favorited' : ''} ${!isAuthenticated ? 'not-authenticated' : ''}`} 
      />
    </Button>
  );
}

export default FavoriteButton;