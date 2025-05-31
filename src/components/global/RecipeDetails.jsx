import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Spinner, Alert, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

// Import existing components
import RecipeHeader from "../recipeDetails/RecipeHeader";
import RecipeMeta from "../recipeDetails/RecipeMeta";
import RecipeDescription from "../recipeDetails/RecipeDescription";
import RecipeIngredients from "../recipeDetails/RecipeIngredients";
import RecipeInstructions from "../recipeDetails/RecipeInstructions";
import RecipeNotes from "../recipeDetails/RecipeNotes";
import RecipeNutrition from "../recipeDetails/RecipeNutrition";

function RecipeDetails({ 
  show, 
  onHide, 
  recipe, 
  isCommunityRecipe = false,
  onFavoriteChange 
}) {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  const fetchSpoonacularRecipeDetails = useCallback(async () => {
    if (!recipe?.id) return;
    
    setLoading(true);
    setError("");
    
    try {
      console.log('Fetching Spoonacular recipe details for ID:', recipe.id);
      
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${recipe.id}/information`,
        {
          params: {
            apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY
          }
        }
      );
      
      console.log('Spoonacular API response:', response.data);
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
      console.log('Fetching community recipe details for ID:', recipe.id);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/community/${recipe.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Community API response:', data);
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
    
    // Reset state when modal closes
    if (!show) {
      setRecipeDetails(null);
      setError("");
    }
  }, [show, recipe, isCommunityRecipe, fetchCommunityRecipeDetails, fetchSpoonacularRecipeDetails]);

  const handleClose = () => {
    setRecipeDetails(null);
    setError("");
    onHide();
  };

  if (!recipe) return null;

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      size="lg"
      className="recipe-details-modal"
    >
      <Modal.Header closeButton>
        <RecipeHeader 
          title={recipe.title}
          mood={recipe.mood || "Happy"}
          isCommunityRecipe={isCommunityRecipe}
          approved={recipe.approved}
          isModal={true}
        />
      </Modal.Header>
      
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Loading recipe details...</p>
          </div>
        ) : recipeDetails ? (
          <>
            <RecipeMeta 
              recipe={recipe}
              recipeDetails={recipeDetails}
              isCommunityRecipe={isCommunityRecipe}
              isAuthenticated={isAuthenticated}
              onFavoriteChange={onFavoriteChange}
            />
            
            <Tabs defaultActiveKey="overview" className="mb-3">
              <Tab eventKey="overview" title="Overview">
                <RecipeDescription 
                  recipe={recipe}
                  recipeDetails={recipeDetails}
                  isCommunityRecipe={isCommunityRecipe}
                />
              </Tab>

              <Tab eventKey="ingredients" title="Ingredients">
                <RecipeIngredients 
                  recipeDetails={recipeDetails}
                  isCommunityRecipe={isCommunityRecipe}
                />
              </Tab>

              <Tab eventKey="instructions" title="Instructions">
                <RecipeInstructions 
                  recipeDetails={recipeDetails}
                  isCommunityRecipe={isCommunityRecipe}
                />
              </Tab>

              {/* Notes tab for authenticated users */}
              {isAuthenticated && (
                <Tab eventKey="notes" title="My Notes">
                  <RecipeNotes recipe={recipe} />
                </Tab>
              )}

              {/* Nutrition tab only for Spoonacular recipes */}
              {!isCommunityRecipe && recipeDetails?.nutrition && (
                <Tab eventKey="nutrition" title="Nutrition">
                  <RecipeNutrition nutrition={recipeDetails.nutrition} />
                </Tab>
              )}
            </Tabs>
          </>
        ) : (
          <div className="text-center p-4">
            <p className="text-muted">No recipe details available</p>
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        
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
      </Modal.Footer>
    </Modal>
  );
}

export default RecipeDetails;