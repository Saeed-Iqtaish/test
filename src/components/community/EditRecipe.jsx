import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { FiPlus, FiMinus } from "react-icons/fi";

function EditRecipe({ show, onHide, recipe, onRecipeUpdated }) {
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
    }
  }, [show, recipe]);

  function handleInputChange(e) {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  }

  function handleIngredientChange(index, value) {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  }

  function addIngredient() {
    setIngredients([...ingredients, ""]);
  }

  function removeIngredient(index) {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  }

  function handleInstructionChange(index, value) {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  }

  function addInstruction() {
    setInstructions([...instructions, ""]);
  }

  function removeInstruction(index) {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!recipe?.id) return;
    
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("ingredients", JSON.stringify(ingredients.filter(ing => ing.trim())));
      submitData.append("instructions", JSON.stringify(instructions.filter(inst => inst.trim())));
      
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const response = await fetch(`/api/community/${recipe.id}`, {
        method: "PUT",
        body: submitData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to update recipe");
      }

      onRecipeUpdated();
    } catch (err) {
      console.error("Error updating recipe:", err);
      setError(err.message || "Failed to update recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      size="lg"
      className="edit-recipe-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Recipe</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
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

          <Form.Group className="mb-3">
            <Form.Label>Ingredients *</Form.Label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="d-flex mb-2">
                <Form.Control
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  required={index === 0}
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => removeIngredient(index)}
                  disabled={ingredients.length === 1}
                >
                  <FiMinus />
                </Button>
              </div>
            ))}
            <Button variant="outline-primary" size="sm" onClick={addIngredient}>
              <FiPlus className="me-1" />
              Add Ingredient
            </Button>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Instructions *</Form.Label>
            {instructions.map((instruction, index) => (
              <div key={index} className="d-flex mb-2">
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  required={index === 0}
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => removeInstruction(index)}
                  disabled={instructions.length === 1}
                >
                  <FiMinus />
                </Button>
              </div>
            ))}
            <Button variant="outline-primary" size="sm" onClick={addInstruction}>
              <FiPlus className="me-1" />
              Add Step
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
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
    </Modal>
  );
}

export default EditRecipe;