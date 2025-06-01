import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import "../../../styles/community/recipe-ingredients-list.css";

function RecipeIngredientsList({ ingredients, onChange }) {
  function handleIngredientChange(index, value) {
    const newIngredients = ingredients.map((item, i) => i === index ? value : item);
    onChange(newIngredients);
  }

  function addIngredient() {
    onChange([...ingredients, ""]);
  }

  function removeIngredient(index) {
    if (ingredients.length > 1) {
      onChange(ingredients.filter((_, i) => i !== index));
    }
  }

  return (
    <Form.Group className="mb-3">
      <Form.Label>Ingredients *</Form.Label>
      {ingredients.map((ingredient, index) => (
        <Row key={index} className="mb-2">
          <Col>
            <Form.Control
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              placeholder={`Ingredient ${index + 1}`}
            />
          </Col>
          <Col xs="auto">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => removeIngredient(index)}
              disabled={ingredients.length === 1}
            >
              <FiTrash2 />
            </Button>
          </Col>
        </Row>
      ))}
      <Button
        variant="outline-primary"
        size="sm"
        onClick={addIngredient}
        className="d-flex align-items-center gap-1"
      >
        <FiPlus /> Add Ingredient
      </Button>
    </Form.Group>
  );
}

export default RecipeIngredientsList;