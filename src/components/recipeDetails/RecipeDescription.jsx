import React from "react";

function RecipeDescription({ recipe, recipeDetails, isCommunityRecipe = false }) {
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  if (isCommunityRecipe) {
    return (
      <div className="recipe-overview">
        <h6>Recipe Overview</h6>
        <p>This recipe was created and shared by a member of our community.</p>
        
        {recipeDetails?.ingredients && (
          <p>
            <strong>Ingredients:</strong> {recipeDetails.ingredients.length} items
          </p>
        )}
        
        {recipeDetails?.instructions && (
          <p>
            <strong>Instructions:</strong> {recipeDetails.instructions.length} steps
          </p>
        )}
        
        <div className="mt-3">
          <small className="text-muted">
            Community recipes are reviewed and approved by our moderators to ensure quality.
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-summary">
      {recipeDetails?.summary && (
        <>
          <h6>About this recipe</h6>
          <p>{stripHtml(recipeDetails.summary)}</p>
        </>
      )}

      {recipeDetails?.analyzedInstructions && 
       recipeDetails.analyzedInstructions.length > 0 && (
        <div className="quick-instructions mt-4">
          <h6>Quick Stats</h6>
          <p className="text-muted">
            {recipeDetails.analyzedInstructions[0].steps?.length || 0} cooking steps
          </p>
        </div>
      )}

      {!recipeDetails?.summary && (
        <div className="text-center p-4">
          <p className="text-muted">Recipe overview information is being loaded...</p>
        </div>
      )}
    </div>
  );
}

export default RecipeDescription;