import React from "react";

function RecipeIngredients({ recipeDetails, isCommunityRecipe = false }) {
  if (isCommunityRecipe) {
    if (!recipeDetails?.ingredients || recipeDetails.ingredients.length === 0) {
      return (
        <div className="text-center p-4">
          <p className="text-muted">No ingredients available</p>
        </div>
      );
    }

    return (
      <div className="ingredients-section">
        <h6>Ingredients ({recipeDetails.ingredients.length})</h6>
        <ul className="ingredients-list">
          {recipeDetails.ingredients.map((ingredient, index) => (
            <li key={index} className="ingredient-item mb-2">
              {ingredient.ingredient}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!recipeDetails?.extendedIngredients || recipeDetails.extendedIngredients.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted">Loading ingredients...</p>
      </div>
    );
  }

  return (
    <div className="ingredients-section">
      <h6>Ingredients ({recipeDetails.extendedIngredients.length})</h6>
      <ul className="ingredients-list">
        {recipeDetails.extendedIngredients.map((ingredient) => (
          <li key={ingredient.id} className="ingredient-item mb-2">
            <strong>{ingredient.amount} {ingredient.unit}</strong> {ingredient.name}
            {ingredient.original && (
              <small className="text-muted d-block">
                {ingredient.original}
              </small>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeIngredients;