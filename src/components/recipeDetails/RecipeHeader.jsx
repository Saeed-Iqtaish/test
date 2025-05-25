import React from 'react'
import MoodBadge from '../global/MoodBadge';
import "../../styles/recipePage/recipe-header.css"

function RecipeHeader({ title, image, mood }) {
  return (
    <div className="recipe-header">
      <div className="recipe-image-container">
        <img src={image} alt={title} className="recipe-image" />
      </div>

      <div className="recipe-title-group">
        <h1 className="recipe-title">{title}</h1>
        <MoodBadge mood={mood || "Happy"} />
      </div>
    </div>
  );
}

export default RecipeHeader