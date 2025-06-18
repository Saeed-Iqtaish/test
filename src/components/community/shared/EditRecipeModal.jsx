import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner, Row, Col } from "react-bootstrap";
import RecipeIngredientsList from "./RecipeIngredientsList";
import RecipeInstructionsList from "./RecipeInstructionsList";
import RecipeMoodSelector from "../shared/RecipeMoodSelector";
import { communityAPI } from "../../../services/api";

function EditRecipeModal({ show, onHide, recipe, onRecipeUpdated }) {
  const [formData, setFormData] = useState({
    title: "",
    prepTime: "",
    servings: "",
    mood: "Happy",
    image: null
  });
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (show && recipe && recipe.id) {
      console.log('🔄 Populating edit form with recipe:', recipe);
      populateFormData(recipe);
      setIsInitialized(true);
    } else if (!show) {
      resetForm();
      setIsInitialized(false);
    }
  }, [show, recipe]);

  const populateFormData = (recipeData) => {
    setFormData({
      title: recipeData.title || "",
      prepTime: recipeData.prep_time?.toString() || "",
      servings: recipeData.servings?.toString() || "",
      mood: recipeData.mood || "Happy", // Get mood from database or default to Happy
      image: null
    });

    if (recipeData.ingredients && Array.isArray(recipeData.ingredients)) {
      const ingredientsList = recipeData.ingredients.map(ingredient => {
        if (typeof ingredient === 'object' && ingredient.ingredient) {
          return ingredient.ingredient;
        }
        return ingredient.toString();
      }).filter(ing => ing && ing.trim());

      setIngredients(ingredientsList.length > 0 ? ingredientsList : [""]);
      console.log('📋 Populated ingredients:', ingredientsList);
    } else {
      setIngredients([""]);
    }

    if (recipeData.instructions && Array.isArray(recipeData.instructions)) {
      const instructionsList = recipeData.instructions
        .sort((a, b) => {
          if (a.step_number && b.step_number) {
            return a.step_number - b.step_number;
          }
          return 0;
        })
        .map(instruction => {
          if (typeof instruction === 'object' && instruction.instruction) {
            return instruction.instruction;
          }
          return instruction.toString();
        }).filter(inst => inst && inst.trim());

      setInstructions(instructionsList.length > 0 ? instructionsList : [""]);
      console.log('📖 Populated instructions:', instructionsList);
    } else {
      setInstructions([""]);
    }

    setError("");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      prepTime: "",
      servings: "",
      mood: "Happy",
      image: null
    });
    setIngredients([""]);
    setInstructions([""]);
    setError("");
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  function handleMoodChange(mood) {
    setFormData(prev => ({ ...prev, mood }));
  }

  const handleIngredientsChange = (updatedIngredients) => {
    setIngredients(updatedIngredients);
  };

  const handleInstructionsChange = (updatedInstructions) => {
    setInstructions(updatedInstructions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation
      if (!formData.title.trim()) {
        setError("Recipe title is required");
        setLoading(false);
        return;
      }

      if (!formData.prepTime || formData.prepTime <= 0) {
        setError("Valid prep time is required");
        setLoading(false);
        return;
      }

      if (!formData.servings || formData.servings <= 0) {
        setError("Valid number of servings is required");
        setLoading(false);
        return;
      }

      if (!formData.mood) {
        setError("Please select a mood for your recipe");
        setLoading(false);
        return;
      }

      const validIngredients = ingredients.filter(ing => ing.trim());
      const validInstructions = instructions.filter(inst => inst.trim());

      if (validIngredients.length === 0) {
        setError("At least one ingredient is required");
        setLoading(false);
        return;
      }

      if (validInstructions.length === 0) {
        setError("At least one instruction is required");
        setLoading(false);
        return;
      }

      // Create FormData for the API request
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('prep_time', parseInt(formData.prepTime));
      formDataToSend.append('servings', parseInt(formData.servings));
      formDataToSend.append('mood', formData.mood);

      // Add ingredients and instructions
      formDataToSend.append('ingredients', JSON.stringify(validIngredients));
      formDataToSend.append('instructions', JSON.stringify(validInstructions));

      // Add image if provided
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      console.log('🚀 Updating recipe with data:', {
        title: formData.title,
        prep_time: formData.prepTime,
        servings: formData.servings,
        mood: formData.mood,
        ingredients: validIngredients,
        instructions: validInstructions,
        hasImage: !!formData.image
      });

      await communityAPI.updateRecipe(recipe.id, formDataToSend);
      console.log('✅ Recipe updated successfully');
      onRecipeUpdated();
      onHide();
    } catch (err) {
      console.error("❌ Error updating recipe:", err);
      setError(err.response?.data?.details || err.response?.data?.error || "Failed to update recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    onHide();
  };

  if (show && !isInitialized && recipe) {
    return (
      <Modal show={show} onHide={handleClose} size="lg" className="edit-recipe-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3">Loading recipe data...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      className="edit-recipe-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Recipe: {formData.title || 'Loading...'}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Recipe Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter recipe title"
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Prep Time (minutes) *</Form.Label>
                <Form.Control
                  type="number"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 30"
                  min="1"
                  max="1440"
                  required
                />
                <Form.Text className="text-muted">
                  Total preparation and cooking time
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Servings *</Form.Label>
                <Form.Control
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleInputChange}
                  placeholder="e.g., 4"
                  min="1"
                  max="50"
                  required
                />
                <Form.Text className="text-muted">
                  Number of people this serves
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Update Recipe Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
            />
            <Form.Text className="text-muted">
              Leave empty to keep current image. Max size: 5MB
            </Form.Text>
          </Form.Group>

          <RecipeMoodSelector
            selectedMood={formData.mood}
            onMoodChange={handleMoodChange}
            disabled={loading}
          />

          <RecipeIngredientsList
            ingredients={ingredients}
            onChange={handleIngredientsChange}
          />

          <RecipeInstructionsList
            instructions={instructions}
            onChange={handleInstructionsChange}
          />

          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-3">
              <summary className="text-muted small">Debug Info (Dev Only)</summary>
              <pre className="small text-muted mt-2">
                Form Data: {JSON.stringify({
                  title: formData.title,
                  prepTime: formData.prepTime,
                  servings: formData.servings,
                  mood: formData.mood,
                  hasImage: !!formData.image
                }, null, 2)}
                Ingredients: {JSON.stringify(ingredients, null, 2)}
                Instructions: {JSON.stringify(instructions, null, 2)}
              </pre>
            </details>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading || !formData.title.trim() || !formData.prepTime || !formData.servings || !formData.mood || !isInitialized}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              "Update Recipe"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditRecipeModal;