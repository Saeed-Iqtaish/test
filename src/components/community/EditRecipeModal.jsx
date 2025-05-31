import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import RecipeIngredientsList from "./RecipeIngredientsList";
import RecipeInstructionsList from "./RecipeInstructionsList";
import { communityAPI } from "../../services/api";

function EditRecipeModal({ show, onHide, recipe, onRecipeUpdated }) {
  const [formData, setFormData] = useState({
    title: "",
    image: null
  });
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show && recipe) {
      setFormData({
        title: recipe.title || "",
        image: null
      });
      
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        setIngredients(recipe.ingredients.map(ing => ing.ingredient || ing));
      } else {
        setIngredients([""]);
      }
      
      if (recipe.instructions && recipe.instructions.length > 0) {
        const sortedInstructions = recipe.instructions
          .sort((a, b) => (a.step_number || 0) - (b.step_number || 0))
          .map(inst => inst.instruction || inst);
        setInstructions(sortedInstructions);
      } else {
        setInstructions([""]);
      }
      
      setError("");
    }
  }, [show, recipe]);

  function handleInputChange(e) {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  }

  function handleIngredientsChange(newIngredients) {
    setIngredients(newIngredients);
  }

  function handleInstructionsChange(newInstructions) {
    setInstructions(newInstructions);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!recipe?.id) return;
    
    setLoading(true);
    setError("");

    if (!formData.title.trim()) {
      setError("Recipe title is required");
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

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("ingredients", JSON.stringify(validIngredients));
      submitData.append("instructions", JSON.stringify(validInstructions));
      
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      await communityAPI.updateRecipe(recipe.id, submitData);
      
      console.log('✅ Recipe updated successfully!');
      onRecipeUpdated();
      onHide();
    } catch (err) {
      console.error("❌ Error updating recipe:", err);
      setError(err.response?.data?.details || err.response?.data?.error || "Failed to update recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setError("");
    onHide();
  }

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      size="lg"
      className="edit-recipe-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Recipe</Modal.Title>
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

          <Form.Group className="mb-3">
            <Form.Label>Update Recipe Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
            />
            <Form.Text className="text-muted">
              Leave empty to keep current image
            </Form.Text>
          </Form.Group>

          <RecipeIngredientsList
            ingredients={ingredients}
            onChange={handleIngredientsChange}
          />

          <RecipeInstructionsList
            instructions={instructions}
            onChange={handleInstructionsChange}
          />
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading || !formData.title.trim()}
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