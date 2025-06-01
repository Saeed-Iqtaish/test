import React from 'react';
import { Badge } from 'react-bootstrap';
import MoodBadge from '../../global/MoodBadge';
import FavoriteButton from '../../global/FavoriteButton';
import { useAuth } from '../../../contexts/AuthContext';

function CommunityRecipeHeader({ 
  recipe, 
  onFavoriteChange, 
  onLoginRequired 
}) {
  const { user, isAuthenticated } = useAuth();

  const canSeeStatus = () => {
    return isAuthenticated && user?.id === recipe?.created_by;
  };

  if (!recipe) return null;

  return (
    <div className="recipe-header-section mb-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <h1 className="recipe-title mb-0">{recipe.title}</h1>
          <MoodBadge mood={recipe.mood} />
          {canSeeStatus() && (
            recipe.approved ? (
              <Badge bg="success">✓ Approved</Badge>
            ) : (
              <Badge bg="warning">⏳ Pending</Badge>
            )
          )}
        </div>
        <FavoriteButton 
          recipeId={recipe.id}
          isCommunityRecipe={true}
          onFavoriteChange={onFavoriteChange}
          onLoginRequired={onLoginRequired}
        />
      </div>
    </div>
  );
}

export default CommunityRecipeHeader;