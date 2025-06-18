import React from "react";

function RecipeInstructions({ recipeDetails, isCommunityRecipe = false }) {
  if (isCommunityRecipe) {
    if (!recipeDetails?.instructions || recipeDetails.instructions.length === 0) {
      return (
        <div className="text-center p-4">
          <p className="text-muted">No instructions available</p>
        </div>
      );
    }

    return (
      <div className="instructions-section">
        <h6>Cooking Instructions</h6>
        <ol className="instructions-list">
          {recipeDetails.instructions
            .sort((a, b) => a.step_number - b.step_number)
            .map((instruction, index) => (
              <li key={index} className="instruction-step mb-3">
                <strong>Step {instruction.step_number}</strong>
                <p className="mt-1">{instruction.instruction}</p>
              </li>
            ))}
        </ol>
      </div>
    );
  }

  if (!recipeDetails?.analyzedInstructions || 
      recipeDetails.analyzedInstructions.length === 0 ||
      !recipeDetails.analyzedInstructions[0]?.steps) {
    return (
      <div className="text-center p-4">
        <p className="text-muted">Loading instructions...</p>
      </div>
    );
  }

  return (
    <div className="instructions-section">
      <h6>Cooking Instructions</h6>
      <ol className="instructions-list">
        {recipeDetails.analyzedInstructions[0].steps.map((step) => (
          <li key={step.number} className="instruction-step mb-3">
            <strong>Step {step.number}</strong>
            <p className="mt-1">{step.step}</p>
            {step.ingredients && step.ingredients.length > 0 && (
              <small className="text-muted">
                Ingredients: {step.ingredients.map(ing => ing.name).join(', ')}
              </small>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default RecipeInstructions;