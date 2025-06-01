import React from "react";
import { Card, Badge } from "react-bootstrap";
import MoodBadge from "../global/MoodBadge";
import "../../styles/admin/admin-recipe-card.css";

function AdminRecipeCard({ recipe, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick(recipe);
    }
  };

  const getCardClass = () => {
    return "admin-recipe-card h-100 shadow-sm clickable-card";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = () => {
    if (recipe.image_data) {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/community/${recipe.id}/image`;
    }
    return null;
  };

  return (
    <Card
      className={getCardClass()}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {getImageUrl() ? (
        <Card.Img
          variant="top"
          src={getImageUrl()}
          alt={recipe.title}
          className="card-img-top"
          style={{ objectFit: "cover", height: "200px" }}
          onError={(e) => {
            console.error('Error loading admin recipe card image:', e.target.src);
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div
          className="d-flex align-items-center justify-content-center bg-light"
          style={{ height: "200px" }}
        >
          <span className="text-muted">📷 No Image</span>
        </div>
      )}

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between mb-2 align-items-start">
          <MoodBadge mood={recipe.mood} />
          <Badge bg="warning" className="pending-badge">
            ⏳ Pending
          </Badge>
        </div>

        <Card.Title as="h6" className="recipe-title">
          {recipe.title}
        </Card.Title>

        <Card.Text className="text-muted recipe-meta">
          <small>
            <strong>Prep Time:</strong> {recipe.prep_time} mins •{' '}
            <strong>Servings:</strong> {recipe.servings}
          </small>
        </Card.Text>

        <div className="creator-info mb-2">
          <small className="text-muted">
            <strong>Created by:</strong>{' '}
            <span className={recipe.created_by_username === "Anonymous" ? "text-muted" : "text-primary"}>
              {recipe.created_by_username || "Anonymous"}
            </span>
          </small>
        </div>

        <div className="submission-date mt-auto">
          <small className="text-muted">
            <strong>Submitted:</strong><br />
            {formatDate(recipe.created_at)}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
}

export default AdminRecipeCard;