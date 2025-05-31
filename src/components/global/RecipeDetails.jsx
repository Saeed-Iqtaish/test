import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Badge, Alert, Spinner, Tab, Tabs } from "react-bootstrap";
import { FiClock, FiUsers, FiUser, FiEdit3 } from "react-icons/fi";
import axios from "axios";
import MoodBadge from "./MoodBadge";
import FavoriteButton from "./FavoriteButton";
import "../../styles/global/recipe-details.css";

function RecipeDetails({ 
  show, 
  onHide, 
  recipe, 
  isCommunityRecipe = false,
  onFavoriteChange,
  onRecipeUpdated 
}) {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSpoonacularRecipeDetails = useCallback(async () => {
    if (!recipe?.id) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
        params: {
          apiKey: "68f91166a81747958d41b82fa5f038c9"
        }
      });
      setRecipeDetails(response.data);
    } catch (err) {
      console.error("Error fetching Spoonacular recipe details:", err);
      setError("Failed to load recipe details");
    } finally {
      setLoading(false);
    }
  }, [recipe?.id]);

  const fetchCommunityRecipeDetails = useCallback(async () => {
    if (!recipe?.id) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/community/${recipe.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipe details");
      }
      const data = await response.json();
      setRecipeDetails(data);
    } catch (err) {
      console.error("Error fetching community recipe details:", err);
      setError("Failed to load recipe details");
    } finally {
      setLoading(false);
    }
  }, [recipe?.id]);

  useEffect(() => {
    if (show && recipe) {
      if (isCommunityRecipe) {
        fetchCommunityRecipeDetails();
      } else {
        fetchSpoonacularRecipeDetails();
      }
    }
  }, [show, recipe, isCommunityRecipe, fetchCommunityRecipeDetails, fetchSpoonacularRecipeDetails]);

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!recipe) return null;

  const getRecipeImage = () => {
    if (isCommunityRecipe) {
      return recipe.image_data ? `/api/community/${recipe.id}/image` : null;
    }
    return recipe.image;
  };

  const getRecipeTitle = () => recipe.title;
  const getRecipeMood = () => recipe.mood || "Happy";

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      size="lg"
      className="recipe-details-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-3">
          {getRecipeTitle()}
          <MoodBadge mood={getRecipeMood()} />
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Loading recipe details...</p>
          </div>
        ) : (
          <div className="recipe-details-content">
            {/* Recipe Image */}
            {getRecipeImage() && (
              <div className="recipe-image-section mb-4">
                <img
                  src={getRecipeImage()}
                  alt={getRecipeTitle()}
                  className="recipe-detail-image w-100"
                  style={{ maxHeight: '300px', objectFit: 'cover', borderRadius: '12px' }}
                />
              </div>
            )}

            {/* Recipe Meta Info */}
            <div className="recipe-meta-section mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="recipe-meta-info d-flex gap-4 flex-wrap">
                  {/* Time and Servings for Spoonacular recipes */}
                  {!isCommunityRecipe && (
                    <>
                      <div className="meta-item d-flex align-items-center gap-2">
                        <FiClock className="text-primary" />
                        <span><strong>Ready in:</strong> {formatTime(recipe.readyInMinutes)}</span>
                      </div>
                      <div className="meta-item d-flex align-items-center gap-2">
                        <FiUsers className="text-primary" />
                        <span><strong>Servings:</strong> {recipe.servings || 'N/A'}</span>
                      </div>
                    </>
                  )}
                  
                  {/* Creator and date for community recipes */}
                  {isCommunityRecipe && (
                    <>
                      <div className="meta-item d-flex align-items-center gap-2">
                        <FiUser className="text-primary" />
                        <span><strong>Created by:</strong> {recipe.created_by_username || "Anonymous"}</span>
                      </div>
                      <div className="meta-item d-flex align-items-center gap-2">
                        <FiClock className="text-primary" />
                        <span><strong>Created:</strong> {formatDate(recipe.created_at)}</span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Favorite button only for Spoonacular recipes */}
                {!isCommunityRecipe && (
                  <FavoriteButton 
                    recipeId={recipe.id} 
                    onFavoriteChange={onFavoriteChange}
                  />
                )}
              </div>

              {/* Diet Labels for Spoonacular recipes */}
              {!isCommunityRecipe && recipe.diets && recipe.diets.length > 0 && (
                <div className="diet-badges mb-3">
                  {recipe.diets.map((diet) => (
                    <Badge key={diet} bg="success" className="me-2 mb-1">
                      {diet}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Approval status for community recipes */}
              {isCommunityRecipe && (
                <div className="approval-status mb-3">
                  {recipe.approved ? (
                    <Badge bg="success" className="me-2">✓ Approved</Badge>
                  ) : (
                    <Badge bg="warning" className="me-2">⏳ Pending Approval</Badge>
                  )}
                  <Badge bg="info">Community Recipe</Badge>
                </div>
              )}
            </div>

            {/* Recipe Content Tabs */}
            <Tabs defaultActiveKey="overview" className="mb-3">
              <Tab eventKey="overview" title="Overview">
                {/* Spoonacular summary */}
                {!isCommunityRecipe && recipeDetails?.summary && (
                  <div className="recipe-summary">
                    <h6>About this recipe</h6>
                    <p>{stripHtml(recipeDetails.summary)}</p>
                  </div>
                )}

                {/* Community recipe basic info */}
                {isCommunityRecipe && (
                  <div className="recipe-overview">
                    <h6>Recipe Overview</h6>
                    <p>This recipe was created and shared by a member of our community.</p>
                    {recipeDetails?.ingredients && (
                      <p><strong>Ingredients:</strong> {recipeDetails.ingredients.length} items</p>
                    )}
                    {recipeDetails?.instructions && (
                      <p><strong>Instructions:</strong> {recipeDetails.instructions.length} steps</p>
                    )}
                  </div>
                )}

                {/* Quick stats */}
                {!isCommunityRecipe && recipeDetails?.analyzedInstructions && recipeDetails.analyzedInstructions.length > 0 && (
                  <div className="quick-instructions mt-4">
                    <h6>Quick Stats</h6>
                    <p className="text-muted">
                      {recipeDetails.analyzedInstructions[0].steps?.length || 0} cooking steps
                    </p>
                  </div>
                )}
              </Tab>

              <Tab eventKey="ingredients" title="Ingredients">
                {/* Spoonacular ingredients */}
                {!isCommunityRecipe && recipeDetails?.extendedIngredients && recipeDetails.extendedIngredients.length > 0 ? (
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
                ) : isCommunityRecipe && recipeDetails?.ingredients && recipeDetails.ingredients.length > 0 ? (
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
                ) : (
                  <p className="text-muted">Loading ingredients...</p>
                )}
              </Tab>

              <Tab eventKey="instructions" title="Instructions">
                {/* Spoonacular instructions */}
                {!isCommunityRecipe && recipeDetails?.analyzedInstructions && recipeDetails.analyzedInstructions.length > 0 ? (
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
                ) : isCommunityRecipe && recipeDetails?.instructions && recipeDetails.instructions.length > 0 ? (
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
                ) : (
                  <p className="text-muted">Loading instructions...</p>
                )}
              </Tab>

              {/* Nutrition tab only for Spoonacular recipes */}
              {!isCommunityRecipe && recipeDetails?.nutrition && (
                <Tab eventKey="nutrition" title="Nutrition">
                  <div className="nutrition-section">
                    <h6>Nutrition Information</h6>
                    {recipeDetails.nutrition.nutrients && (
                      <div className="nutrition-grid">
                        {recipeDetails.nutrition.nutrients
                          .filter(nutrient => ['Calories', 'Protein', 'Fat', 'Carbohydrates', 'Fiber', 'Sugar'].includes(nutrient.name))
                          .map((nutrient) => (
                            <div key={nutrient.name} className="nutrition-item mb-2">
                              <strong>{nutrient.name}:</strong> {nutrient.amount}{nutrient.unit}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </Tab>
              )}
            </Tabs>
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        
        {/* Different action buttons based on recipe type */}
        {!isCommunityRecipe && recipeDetails?.sourceUrl && (
          <Button
            variant="primary"
            href={recipeDetails.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Original Recipe
          </Button>
        )}
        
        {isCommunityRecipe && onRecipeUpdated && (
          <Button
            variant="outline-primary"
            onClick={() => {
              // This would open an edit modal
              console.log('Edit recipe functionality would go here');
            }}
          >
            <FiEdit3 className="me-2" />
            Edit Recipe
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default RecipeDetails;