import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Spinner, Alert, Tabs, Tab, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import MoodBadge from "../global/MoodBadge";
import RecipeIngredients from "../recipeDetails/RecipeIngredients";
import RecipeInstructions from "../recipeDetails/RecipeInstructions";
import RecipeNotes from "../recipeDetails/RecipeNotes";
import RecipeRating from "../ratings/RecipeRating";

function RecipeDetails({
  show,
  onHide,
  recipe,
  isCommunityRecipe = false,
  onFavoriteChange,
  onViewFullRecipe
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

  const handleViewFullRecipe = () => {
    if (onViewFullRecipe && recipe) {
      onViewFullRecipe(recipe);
    }
  };

  const getRecipeImage = () => {
    if (isCommunityRecipe) {
      return recipe?.image_data ?
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/community/${recipe.id}/image` :
        null;
    }
    return recipe?.image || recipeDetails?.image;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getIngredientsCount = () => {
    if (isCommunityRecipe) {
      return recipeDetails?.ingredients?.length || 0;
    }
    return recipeDetails?.extendedIngredients?.length || 0;
  };

  if (!recipe) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      className="recipe-details-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <div className="d-flex align-items-center gap-3 w-100">
          <h4 className="mb-0 flex-grow-1">{recipe.title}</h4>
          <MoodBadge mood={recipe.mood || "Happy"} />
        </div>
      </Modal.Header>

      <Modal.Body className="pt-2">
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
        ) : (
          <Row className="h-100">
            <Col lg={5} className="pe-4">
              {getRecipeImage() && (
                <div className="recipe-image-section mb-4">
                  <img
                    src={getRecipeImage()}
                    alt={recipe.title}
                    className="w-100"
                    style={{
                      borderRadius: '12px',
                      objectFit: 'cover',
                      maxHeight: '300px'
                    }}
                    onError={(e) => {
                      console.error('Error loading recipe image:', e.target.src);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {isCommunityRecipe && (
                <div className="rating-section mb-4">
                  <RecipeRating
                    recipeId={recipe.id}
                    isCommunityRecipe={true}
                    size="sm"
                    showUserRating={true}
                    className="border rounded p-3 bg-light"
                  />
                </div>
              )}

              <div className="recipe-meta mb-3">
                {!isCommunityRecipe && recipeDetails && (
                  <>
                    <div className="meta-item mb-2">
                      <strong>Prep Time:</strong> {recipeDetails.readyInMinutes} Mins
                    </div>
                    <div className="meta-item mb-2">
                      <strong>Servings:</strong> {recipeDetails.servings}
                    </div>
                  </>
                )}

                {isCommunityRecipe && (
                  <>
                    <div className="meta-item mb-2">
                      <strong>Created by:</strong> {recipe.created_by_username || "Anonymous"}
                    </div>
                    <div className="meta-item mb-2">
                      <strong>Created:</strong> {recipe.created_at ? formatDate(recipe.created_at) : 'Unknown'}
                    </div>
                  </>
                )}

                <div className="meta-item mb-2">
                  <strong>Ingredients:</strong> {getIngredientsCount()}
                </div>
              </div>

              {isAuthenticated && (
                <div className="notes-section">
                  <h6 className="mb-3">Personal Notes</h6>
                  <RecipeNotes recipe={recipe} isCommunityRecipe={isCommunityRecipe} />
                </div>
              )}
            </Col>

            <Col lg={7} className="ps-4 border-start">
              {recipeDetails ? (
                <Tabs defaultActiveKey="ingredients" className="mb-3">
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
                </Tabs>
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted">Recipe details loading...</p>
                </div>
              )}
            </Col>
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>

        {isCommunityRecipe && onViewFullRecipe && (
          <Button
            variant="primary"
            onClick={handleViewFullRecipe}
          >
            View Full Recipe
          </Button>
        )}

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