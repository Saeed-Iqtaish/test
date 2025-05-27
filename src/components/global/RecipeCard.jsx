// src/components/global/RecipeCard.jsx (Fixed)
import React from "react";
import { Card, Badge } from "react-bootstrap";
import MoodBadge from "./MoodBadge";
import "../../styles/global/recipe-card.css";

function RecipeCard({ recipe, isCommunityRecipe = false }) {
  const title = recipe.title;
  const image = isCommunityRecipe 
    ? (recipe.image_data ? `/api/community/${recipe.id}/image` : null)
    : recipe.image;
  const prepTime = isCommunityRecipe ? "N/A" : `${recipe.readyInMinutes} mins`;
  const servings = isCommunityRecipe ? "N/A" : recipe.servings;
  const mood = recipe.mood || "Happy";

  const cardClass = isCommunityRecipe 
    ? "community-recipe-card flex-fill shadow-sm h-100"
    : "flex-fill shadow-sm h-100";

  return (
    <Card className={cardClass}>
      {image ? (
        <Card.Img
          variant="top"
          src={image}
          alt={title}
          className="card-img-top"
          style={{ objectFit: "cover", height: "200px" }}
        />
      ) : (
        <div 
          className="d-flex align-items-center justify-content-center bg-light"
          style={{ height: "200px" }}
        >
          <span className="text-muted">No Image Available</span>
        </div>
      )}
      
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between mb-2 align-items-start">
          <Card.Title as="h6" className="mb-0">
            {title}
          </Card.Title>
          <MoodBadge mood={mood} />
        </div>
        
        {isCommunityRecipe ? (
          <>
            <Card.Text className="recipe-creator" style={{ fontSize: "0.85rem" }}>
              <strong>Created by:</strong> {recipe.created_by}
            </Card.Text>
            
            <div className="approval-status mb-2">
              {recipe.approved ? (
                <Badge bg="success">✓ Approved</Badge>
              ) : (
                <Badge bg="warning">⏳ Pending Approval</Badge>
              )}
            </div>
            
            <div className="recipe-meta-info mt-auto">
              <small className="recipe-date">
                Created: {new Date(recipe.created_at).toLocaleDateString()}
              </small>
            </div>
          </>
        ) : (
          <>
            <Card.Text className="text-muted" style={{ fontSize: "0.85rem" }}>
              Prep Time: {prepTime} &bull; Servings: {servings}
            </Card.Text>

            <div className="mt-2">
              {recipe.diets?.map(function (diet) {
                return (
                  <Badge key={diet} bg="success" className="me-1">
                    {diet}
                  </Badge>
                );
              })}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default RecipeCard;