import React from "react";

function RecipeNutrition({ nutrition }) {
  if (!nutrition?.nutrients) {
    return (
      <div className="text-center p-4">
        <p className="text-muted">Nutrition information not available</p>
      </div>
    );
  }

  const importantNutrients = ['Calories', 'Protein', 'Fat', 'Carbohydrates', 'Fiber', 'Sugar', 'Sodium'];
  
  const filteredNutrients = nutrition.nutrients.filter(nutrient => 
    importantNutrients.includes(nutrient.name)
  );

  return (
    <div className="nutrition-section">
      <h6>Nutrition Information</h6>
      <div className="nutrition-grid">
        {filteredNutrients.map((nutrient) => (
          <div key={nutrient.name} className="nutrition-item mb-2">
            <strong>{nutrient.name}:</strong> {nutrient.amount}{nutrient.unit}
          </div>
        ))}
      </div>
      
      {filteredNutrients.length === 0 && (
        <p className="text-muted">Detailed nutrition information is not available for this recipe.</p>
      )}
      
      <div className="mt-3">
        <small className="text-muted">
          Nutrition values are approximate and may vary based on cooking methods and ingredient brands.
        </small>
      </div>
    </div>
  );
}

export default RecipeNutrition;