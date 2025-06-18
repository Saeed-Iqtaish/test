import React from "react";
import { Badge } from "react-bootstrap";
import { FiClock, FiUsers, FiUser } from "react-icons/fi";
import FavoriteButton from "../global/FavoriteButton";

function RecipeMeta({ 
  recipe, 
  recipeDetails, 
  isCommunityRecipe = false, 
  isAuthenticated = false, 
  onFavoriteChange 
}) {
  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRecipeImage = () => {
    if (isCommunityRecipe) {
      return recipe?.image_data ? 
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/community/${recipe.id}/image` : 
        null;
    }
    return recipe?.image || recipeDetails?.image;
  };

  return (
    <div className="recipe-meta-section mb-4">
      {getRecipeImage() && (
        <div className="recipe-image-section mb-4">
          <img
            src={getRecipeImage()}
            alt={recipe?.title || 'Recipe'}
            className="recipe-detail-image w-100"
            style={{ 
              maxHeight: '300px', 
              objectFit: 'cover', 
              borderRadius: '12px' 
            }}
            onError={(e) => {
              console.error('Error loading recipe image:', e.target.src);
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div className="recipe-meta-info d-flex gap-4 flex-wrap">
          {!isCommunityRecipe && (
            <>
              <div className="meta-item d-flex align-items-center gap-2">
                <FiClock className="text-primary" />
                <span>
                  <strong>Ready in:</strong> {formatTime(recipeDetails?.readyInMinutes || recipe?.readyInMinutes)}
                </span>
              </div>
              <div className="meta-item d-flex align-items-center gap-2">
                <FiUsers className="text-primary" />
                <span>
                  <strong>Servings:</strong> {recipeDetails?.servings || recipe?.servings || 'N/A'}
                </span>
              </div>
            </>
          )}
          
          {isCommunityRecipe && (
            <>
              <div className="meta-item d-flex align-items-center gap-2">
                <FiClock className="text-primary" />
                <span>
                  <strong>Prep Time:</strong> {recipe?.prep_time ? `${recipe.prep_time} mins` : 'N/A'}
                </span>
              </div>
              <div className="meta-item d-flex align-items-center gap-2">
                <FiUsers className="text-primary" />
                <span>
                  <strong>Servings:</strong> {recipe?.servings || 'N/A'}
                </span>
              </div>
              <div className="meta-item d-flex align-items-center gap-2">
                <FiUser className="text-primary" />
                <span>
                  <strong>Created by:</strong> {recipe?.created_by_username || "Anonymous"}
                </span>
              </div>
              <div className="meta-item d-flex align-items-center gap-2">
                <FiClock className="text-primary" />
                <span>
                  <strong>Created:</strong> {recipe?.created_at ? formatDate(recipe.created_at) : 'Unknown'}
                </span>
              </div>
            </>
          )}
        </div>
        
        {!isCommunityRecipe && isAuthenticated && recipe?.id && (
          <FavoriteButton 
            recipeId={recipe.id} 
            onFavoriteChange={onFavoriteChange}
          />
        )}
      </div>

      {!isCommunityRecipe && recipeDetails?.diets && recipeDetails.diets.length > 0 && (
        <div className="diet-badges mb-3">
          {recipeDetails.diets.map((diet) => (
            <Badge key={diet} bg="success" className="me-2 mb-1">
              {diet}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeMeta;