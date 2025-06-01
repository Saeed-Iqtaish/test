import React, { useState, useEffect } from "react";
import { Modal, Button, Badge, Alert, Spinner } from "react-bootstrap";
import { FiUser, FiClock, FiEdit3 } from "react-icons/fi";
import EditRecipe from "../list/EditRecipe";

function RecipeDetails({ show, onHide, recipe, onRecipeUpdated }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show && recipe) {
      fetchRecipeDetails();
    }
  }, [show, recipe]);

  async function fetchRecipeDetails() {
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
      console.error("Error fetching recipe details:", err);
      setError("Failed to load recipe details");
    } finally {
      setLoading(false);
    }
  }

  function handleEditComplete() {
    setShowEditModal(false);
    onRecipeUpdated();
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!recipe) return null;

  return (
    <>
      <Modal 
        show={show} 
        onHide={onHide}
        size="lg"
        className="recipe-details-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{recipe.title}</Modal.Title>
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
              {recipe.image_data && (
                <div className="recipe-image-section mb-4">
                  <img
                    src={`/api/community/${recipe.id}/image`}
                    alt={recipe.title}
                    className="recipe-detail-image"
                  />
                </div>
              )}

              <div className="recipe-meta-section mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="recipe-meta-info">
                    <div className="meta-item mb-2">
                      <FiUser className="me-2" />
                      <span>Created by {recipe.created_by || "Anonymous"}</span>
                    </div>
                    <div className="meta-item">
                      <FiClock className="me-2" />
                      <span>{formatDate(recipe.created_at)}</span>
                    </div>
                  </div>
                  <Badge bg="info">Community Recipe</Badge>
                </div>
              </div>

              {recipeDetails && (
                <>
                  {recipeDetails.ingredients && recipeDetails.ingredients.length > 0 && (
                    <div className="ingredients-section mb-4">
                      <h5>Ingredients</h5>
                      <ul className="ingredients-list">
                        {recipeDetails.ingredients.map((ingredient, index) => (
                          <li key={index}>{ingredient.ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recipeDetails.instructions && recipeDetails.instructions.length > 0 && (
                    <div className="instructions-section">
                      <h5>Instructions</h5>
                      <ol className="instructions-list">
                        {recipeDetails.instructions
                          .sort((a, b) => a.step_number - b.step_number)
                          .map((instruction, index) => (
                            <li key={index} className="instruction-step">
                              {instruction.instruction}
                            </li>
                          ))}
                      </ol>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => setShowEditModal(true)}
            disabled={loading}
          >
            <FiEdit3 className="me-2" />
            Edit Recipe
          </Button>
        </Modal.Footer>
      </Modal>

      <EditRecipe
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        recipe={recipeDetails || recipe}
        onRecipeUpdated={handleEditComplete}
      />
    </>
  );
}

export default RecipeDetails;