import React from 'react'
import { Badge } from "react-bootstrap";
import MoodBadge from '../global/MoodBadge';

function RecipeHeader({ title, image, mood, isCommunityRecipe, approved, isModal = false }) {
  // If this is being used in a modal, render differently
  if (isModal) {
    return (
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <h4 className="mb-0 flex-grow-1">{title}</h4>
        <div className="d-flex align-items-center gap-2">
          <MoodBadge mood={mood || "Happy"} />
          {isCommunityRecipe && (
            <>
              {approved ? (
                <Badge bg="success">✓ Approved</Badge>
              ) : (
                <Badge bg="warning">⏳ Pending</Badge>
              )}
              <Badge bg="info">Community</Badge>
            </>
          )}
        </div>
      </div>
    );
  }

  // Original implementation for full recipe pages
  return (
    <div className="recipe-header">
      <div className="recipe-image-container">
        <img src={image} alt={title} className="recipe-image" />
      </div>

      <div className="recipe-title-group">
        <h1 className="recipe-title">{title}</h1>
        <MoodBadge mood={mood || "Happy"} />
        {isCommunityRecipe && (
          <div className="d-flex align-items-center gap-2 mt-2">
            {approved ? (
              <Badge bg="success">✓ Approved</Badge>
            ) : (
              <Badge bg="warning">⏳ Pending</Badge>
            )}
            <Badge bg="info">Community Recipe</Badge>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeHeader