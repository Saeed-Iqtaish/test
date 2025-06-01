import React from "react";
import { Row, Col } from "react-bootstrap";
import AdminRecipeCard from "./AdminRecipeCard";

function AdminRecipeList({ recipes, onRecipeClick, onRecipeStatusChange }) {
  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {recipes.map((recipe) => (
        <Col key={recipe.id} className="d-flex">
          <AdminRecipeCard
            recipe={recipe}
            onClick={() => onRecipeClick(recipe)}
            onRecipeStatusChange={onRecipeStatusChange}
          />
        </Col>
      ))}
    </Row>
  );
}

export default AdminRecipeList;